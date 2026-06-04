package com.social.adminservice.service;

import com.social.adminservice.client.*;
import com.social.adminservice.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private UserClient userClient;
    @Autowired private EventClient eventClient;
    @Autowired private InteractionClient interactionClient;

    public DashboardStatsDTO getGlobalDashboardData() {
        // 1. Récupération des données de base
        Long totalUsers = 0L;
        try { 
            totalUsers = userClient.countUsers(); 
        } catch(Exception e) {
            System.err.println("Erreur User-service");
        }
        
        // Mock pour le test (à enlever quand Issam a fini)
        if (totalUsers == null || totalUsers == 0) totalUsers = 10L;

        List<EventSummaryDTO> allEvents = new ArrayList<>();
        try { 
            allEvents = eventClient.getAllEvents(); 
        } catch(Exception e) {
            System.err.println("Erreur Event-service");
        }
        
        if (allEvents == null) allEvents = new ArrayList<>();
        
        long totalEvents = allEvents.size();
        long totalInteractions = 0;
        long totalParticipants = 0;
        List<Map<String, Object>> topLikedList = new ArrayList<>();

        // 2. Boucle pour calculer les Interactions et préparer le Top Likes
        for (EventSummaryDTO event : allEvents) {
            long p = 0; long l = 0; long c = 0;
            try {
                // Participants
                Map<String, Object> partRes = interactionClient.getParticipantsCount(event.getId());
                if (partRes != null && partRes.get("count") != null) {
                    p = Long.parseLong(partRes.get("count").toString());
                }
                
                // Likes
                Map<String, Object> likesRes = interactionClient.getEventLikes(event.getId());
                if (likesRes != null && likesRes.get("count") != null) {
                    l = Long.parseLong(likesRes.get("count").toString());
                }

                // Commentaires
                List<CommentSummaryDTO> commsRes = interactionClient.getEventComments(event.getId());
                if (commsRes != null) {
                    c = commsRes.size();
                }
            } catch (Exception e) {
                // Si un appel échoue, on ignore et on continue
            }

            totalParticipants += p;
            totalInteractions += (p + l + c);

            // Préparation pour le Top Likes
            Map<String, Object> eventScore = new HashMap<>();
            eventScore.put("title", event.getTitle() != null ? event.getTitle() : "Sans titre");
            eventScore.put("likes", l);
            eventScore.put("participants", p);
            topLikedList.add(eventScore);
        }

        // 3. Calcul de la répartition par VILLE (Pour ton graphique circulaire)
        Map<String, Long> eventsByCity = allEvents.stream()
            .collect(Collectors.groupingBy(
                e -> (e.getLocation() == null || e.getLocation().isEmpty()) ? "Autres" : e.getLocation(), 
                Collectors.counting()
            ));

        // 4. Tri du Top Likes (On garde les 4 meilleurs)
        topLikedList.sort((a, b) -> Long.compare((long)b.get("likes"), (long)a.get("likes")));
        List<Map<String, Object>> finalTop = topLikedList.stream().limit(4).collect(Collectors.toList());

        // 5. Calcul du taux de participation
        double participationRate = (totalUsers > 0) ? ((double) totalParticipants / totalUsers) * 100 : 0;

        // 6. Construction du DTO final avec tous les paramètres
        return new DashboardStatsDTO(
            totalUsers, 
            totalEvents, 
            totalInteractions, 
            Math.round(participationRate * 10.0) / 10.0, 
            calculateCategories(allEvents), // Utilise la fonction définie plus bas
            eventsByCity,
            finalTop,
            allEvents
        );
    }

    /**
     * FONCTION ADDITIONNELLE : Calcule les catégories
     */
    private Map<String, Long> calculateCategories(List<EventSummaryDTO> events) {
        if (events == null) return new HashMap<>();
        return events.stream()
            .collect(Collectors.groupingBy(
                e -> (e.getCategory() == null || e.getCategory().isEmpty()) ? "Autres" : e.getCategory(),
                Collectors.counting()
            ));
    }

public List<CommentSummaryDTO> getAllCommentsForModeration() {
    List<CommentSummaryDTO> allComments = new ArrayList<>();
    
    try {
        List<EventSummaryDTO> events = eventClient.getAllEvents();
        if (events != null) {
            for (EventSummaryDTO event : events) {
                try {
                    // Maintenant que le client est mis à jour, plus d'erreur ici !
                    List<CommentSummaryDTO> comments = interactionClient.getEventComments(event.getId());
                    if (comments != null) {
                        allComments.addAll(comments);
                    }
                } catch (Exception e) {
                    System.err.println("Erreur comms pour event " + event.getId());
                }
            }
        }
    } catch (Exception e) {
        System.err.println("Erreur globale récupération commentaires");
    }
    
    return allComments;
}
public void hideCommentViaInteractionService(Long id) {
    interactionClient.hideComment(id);
}
}