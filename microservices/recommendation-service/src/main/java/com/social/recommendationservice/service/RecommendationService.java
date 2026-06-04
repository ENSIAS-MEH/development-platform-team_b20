package com.social.recommendationservice.service;

import com.social.recommendationservice.client.*;
import com.social.recommendationservice.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired private UserClient userClient;
    @Autowired private EventClient eventClient;
    @Autowired private InteractionClient interactionClient;

    public List<RecommendationResponseDTO> getRecommendationsForUser(Long userId) {
        // 1. RÉCUPÉRER L'UTILISATEUR (Issam)
        UserDTO user = null;
        try {
            user = userClient.getUserById(userId);
        } catch (Exception e) {
            System.err.println("Note: User-service injoignable pour l'ID: " + userId);
        }

        List<String> userInterests = (user != null && user.getInterests() != null) 
                                     ? user.getInterests() : new ArrayList<>();

        // 2. RÉCUPÉRER TOUS LES ÉVÉNEMENTS (Nizar)
        List<EventDTO> allEvents = new ArrayList<>();
        try {
            allEvents = eventClient.getAllEvents();
        } catch (Exception e) {
            System.err.println("Note: Event-service injoignable");
            return new ArrayList<>();
        }

        List<RecommendationResponseDTO> recommendations = new ArrayList<>();

        for (EventDTO event : allEvents) {
            try {
                // 3. VÉRIFIER SI DÉJÀ INSCRIT (Hamza)
                List<Long> participants = interactionClient.getParticipantIds(event.getId());
                if (participants != null && participants.contains(userId)) {
                    continue; // Déjà inscrit, on l'ignore
                }

                // 4. RÉCUPÉRER LES DONNÉES SOCIALES (Hamza)
                long pCount = 0; long lCount = 0; long cCount = 0;
                
                // Participants count
                Map<String, Object> partRes = interactionClient.getParticipantsCount(event.getId());
                if (partRes != null && partRes.get("count") != null) {
                    pCount = Long.parseLong(partRes.get("count").toString());
                }

                // Likes count
                Map<String, Object> likesRes = interactionClient.getLikesCount(event.getId());
                if (likesRes != null && likesRes.get("count") != null) {
                    lCount = Long.parseLong(likesRes.get("count").toString());
                }

                // Comments count
                List<Object> commsRes = interactionClient.getComments(event.getId());
                cCount = (commsRes != null) ? commsRes.size() : 0;

                // 5. CALCUL DU SCORE (TA FORMULE)
                // Score = (P * 0.8) + ((L + C) * 0.2)
                double score = (pCount * 0.8) + ((lCount + cCount) * 0.2);

                // 6. BONUS INTÉRÊT (+50 points)
                String reason = "Événement populaire";
                if (event.getCategory() != null && !userInterests.isEmpty()) {
                    for (String interest : userInterests) {
                        if (event.getCategory().equalsIgnoreCase(interest)) {
                            score += 50.0; 
                            reason = "⭐ Correspond à votre passion pour " + event.getCategory();
                            break;
                        }
                    }
                }

                // 7. REMPLISSAGE DU DTO FINAL (C'est ce qui répare ton affichage !)
                RecommendationResponseDTO response = new RecommendationResponseDTO();
                response.setEventId(event.getId());
                response.setTitle(event.getTitle());
                response.setDescription(event.getDescription());
                response.setLocation(event.getLocation());
                response.setEventDate(event.getEventDate());
                response.setCategory(event.getCategory());
                response.setImageBase64(event.getImageBase64());
                response.setOrganizerName(event.getOrganizerName());
                response.setScore(Math.round(score * 10.0) / 10.0);
                response.setReason(reason);

                recommendations.add(response);

            } catch (Exception e) {
                System.err.println("Erreur de calcul pour l'évenement ID: " + event.getId());
            }
        }

        // 8. TRIER ET RENVOYER LES 5 MEILLEURS
        return recommendations.stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(5)
                .collect(Collectors.toList());
    }
}