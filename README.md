# Smart Social Event Organizer

Application web microservices permettant aux jeunes de créer, découvrir et participer à des événements selon leurs centres d'intérêt. La plateforme facilite l'interaction sociale grâce aux commentaires, likes et recommandations personnalisées.

## Sommaire

- [Architecture](#architecture)
- [Stack technologique](#stack-technologique)
- [Structure du projet](#structure-du-projet)
- [Les microservices](#les-microservices)
- [Communication entre services](#communication-entre-services)
- [Base de données](#base-de-données)
- [Lancer le projet](#lancer-le-projet)
- [Partie DevOps](#partie-devops)
- [L'équipe](#léquipe)

## Architecture

Le projet suit une architecture microservices. Chaque service est indépendant, possède son propre schéma de base de données, et communique avec les autres via OpenFeign. Toutes les requêtes externes passent par l'API Gateway, qui sert de point d'entrée unique et route vers le bon service grâce au Discovery Server (Eureka).

```
                          React Frontend
                                |
                          (HTTP + JWT)
                                |
                          API Gateway (8080)
                                |
                       Discovery Server (8761)
                                |
        +----------+----------+----------+----------+----------+
        |          |          |          |          |          |
     user-      event-    interaction- admin-  recommendation-
    service    service     service    service     service
     (8081)    (8082)      (8083)     (8084)      (8085)
```

## Stack technologique

Le backend est construit avec Spring Boot, le frontend avec React et Vite, et les données sont stockées dans PostgreSQL (hébergé sur Supabase). Pour la communication inter-services on utilise OpenFeign, avec Resilience4j comme filet de sécurité (Circuit Breaker). La découverte de services est gérée par Eureka et le routage par Spring Cloud Gateway.

| Couche | Technologie |
|--------|-------------|
| Backend | Spring Boot 3.x, Java 17 |
| Frontend | React, Vite, Tailwind CSS |
| Base de données | PostgreSQL (Supabase) |
| Service Discovery | Eureka |
| API Gateway | Spring Cloud Gateway |
| Communication inter-services | OpenFeign |
| Résilience | Resilience4j (Circuit Breaker) |
| Authentification | JWT |
| Conteneurisation | Docker, Docker Compose |
| Orchestration | Kubernetes (Minikube) |
| Infrastructure as Code | Ansible |

## Structure du projet

```
smart-social-event-organizer/
│
├── microservices/
│   ├── discovery-server/      Annuaire Eureka (port 8761)
│   ├── api-gateway/           Porte d'entrée unique (port 8080)
│   ├── user-service/          Authentification et profils (port 8081)
│   ├── event-service/         Gestion des événements (port 8082)
│   ├── interaction-service/   Likes et commentaires (port 8083)
│   ├── admin-service/         Dashboard et modération (port 8084)
│   └── recommendation-service/ Recommandations (port 8085)
│
├── frontend/                  Application React + Vite
│   ├── src/
│   │   ├── services/          Appels API (api.js, authService.js, etc.)
│   │   ├── pages/             Pages de l'application
│   │   └── layouts/           Layouts (AdminLayout, etc.)
│   ├── nginx.conf             Config Nginx pour la production
│   ├── Dockerfile
│   └── vite.config.js         Config Vite avec proxy
│
├── kubernetes/
│   └── base/
│       ├── namespace.yaml
│       ├── configmap.yaml
│       ├── secret.yaml
│       ├── ingress.yaml
│       ├── deployment/        Un Deployment par service
│       └── service/           Un Service par microservice
│
├── ansible/
│   ├── inventory.ini
│   ├── playbook.yml
│   ├── vars/variables.yml
│   └── roles/
│       ├── docker/            Vérifie Docker et les images
│       ├── kubernetes/        Démarre Minikube
│       └── deploy/            Applique les manifests Kubernetes
│
├── docker-compose.yml         Orchestration locale des 8 services
└── README.md
```

## Les microservices

**discovery-server (Eureka)** est l'annuaire du système. Tous les services s'y enregistrent au démarrage, ce qui permet de les retrouver par leur nom plutôt que par une adresse IP fixe.

**api-gateway** est le point d'entrée unique de l'application. Il reçoit toutes les requêtes du frontend, valide le token JWT, puis route vers le bon service. Les routes sont préfixées : `/user-service/**`, `/event-service/**`, etc.

**user-service** gère l'inscription, l'authentification (génération du JWT) et les profils utilisateurs. C'est lui qui détient les comptes et les centres d'intérêt.

**event-service** gère le cycle de vie des événements : création, modification, suppression, recherche, et participation (rejoindre ou quitter un événement).

**interaction-service** gère les likes et les commentaires sur les événements, ainsi que la liste des participants.

**admin-service** fournit le tableau de bord administrateur. Il n'a presque pas de données propres : il agrège les statistiques en interrogeant les autres services via OpenFeign (nombre de membres, d'événements, d'interactions, taux de participation). Il gère aussi la modération du contenu et la suspension d'utilisateurs.

**recommendation-service** suggère des événements à chaque utilisateur. Le score est calculé à la volée en combinant la correspondance des centres d'intérêt (60%) et la popularité de l'événement (40%). Ce service n'a pas de base de données, il calcule tout en temps réel à partir des données des autres services.

## Communication entre services

Deux types de communication coexistent dans le projet :

La **communication externe** (Frontend vers Backend) passe toujours par l'API Gateway sur le port 8080. Le frontend n'appelle jamais directement un service sur son port. La Gateway valide le JWT et route vers le bon service.

La **communication interne** (service vers service) utilise OpenFeign et ne passe pas par la Gateway. Par exemple, quand `admin-service` a besoin du nombre d'utilisateurs, il appelle directement `user-service` via un client Feign. Eureka résout le nom du service vers son adresse réelle.

Pour la résilience, Resilience4j (Circuit Breaker) protège les appels Feign : si un service est indisponible, le circuit s'ouvre et un fallback est renvoyé plutôt que de propager l'erreur en cascade.

## Base de données

Le projet utilise une seule instance PostgreSQL hébergée sur Supabase, avec **un schéma par service** pour garantir l'isolation des données :

| Service | Schéma |
|---------|--------|
| user-service | users_schema |
| event-service | events_schema |
| interaction-service | interactions_schema |
| admin-service | admin_schema |
| recommendation-service | recommendation_schema |

Règle stricte : aucun service n'accède au schéma d'un autre service directement. Si un service a besoin de données d'un autre, il passe par un appel Feign.

## Lancer le projet

### Option 1 — Docker Compose (le plus simple)

Lance les 8 services en une seule commande :

```bash
docker-compose up -d
```

Vérifie que tous les services sont enregistrés dans Eureka : `http://localhost:8761`

### Option 2 — Frontend en développement

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`. Le proxy Vite (configuré dans `vite.config.js`) redirige les appels API vers la Gateway sur le port 8080, ce qui évite les problèmes de CORS.

### Option 3 — Kubernetes

```bash
minikube start

kubectl apply -f kubernetes/base/namespace.yaml
kubectl apply -f kubernetes/base/configmap.yaml
kubectl apply -f kubernetes/base/secret.yaml
kubectl apply -f kubernetes/base/deployment/
kubectl apply -f kubernetes/base/service/
kubectl apply -f kubernetes/base/ingress.yaml

kubectl get pods -n smartevent
```

Pour accéder à l'application via la Gateway :

```bash
kubectl port-forward -n smartevent service/api-gateway 8888:8080
```

### Option 4 — Ansible (déploiement automatisé)

Ansible automatise tout le déploiement Kubernetes en une commande. Il vérifie Docker, démarre Minikube, et applique tous les manifests :

```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

## Partie DevOps

Le projet implémente les trois piliers DevOps demandés :

**Conteneurisation (Docker)** — Chaque microservice et le frontend ont leur propre Dockerfile. Le `docker-compose.yml` orchestre les 8 conteneurs ensemble, ce qui permet de lancer toute l'application avec `docker-compose up`. Plus besoin d'installer Java, Maven ou Node manuellement.

**Orchestration (Kubernetes)** — Les manifests dans `kubernetes/base/` définissent un Deployment et un Service par microservice, plus un ConfigMap, un Secret et un Ingress. Kubernetes redémarre automatiquement un service qui tombe et permet la mise à l'échelle. L'API Gateway et le frontend sont exposés en NodePort, les autres services en ClusterIP (communication interne uniquement).

**Infrastructure as Code (Ansible)** — Le playbook Ansible automatise l'ensemble du déploiement. Organisé en trois rôles (docker, kubernetes, deploy), il vérifie l'environnement, démarre Minikube si nécessaire, puis applique tous les manifests Kubernetes dans le bon ordre. Une seule commande déploie toute l'infrastructure de manière reproductible.

## Stratégie Git

Le projet suit un workflow Git Flow simplifié :

```
main                 Code stable, prêt pour production
└── dev              Branche d'intégration
    ├── feature/docker
    ├── feature/kubernetes-deployments
    ├── feature/kubernetes-ingress
    └── feature/ansible-iac
```

Chaque membre travaille sur sa propre branche de feature, qui est mergée dans `dev` après tests. Une fois que tout est validé sur `dev`, le code est mergé dans `main`.

## L'équipe

| Membre | Responsabilité |
|--------|----------------|
| Issam | user-service (Auth & Profils) + Docker |
| Nizar | event-service (Gestion événements) + Kubernetes Deployments |
| Hamza | interaction-service (Likes & Commentaires) + Kubernetes Config |
| Hatim | admin-service (Dashboard & Recommandations) + Ansible (Infrastructure as Code) |
