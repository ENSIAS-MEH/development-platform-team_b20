package com.social.adminservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.social.adminservice.dto.CommentSummaryDTO;

import java.util.List;
import java.util.Map;

@FeignClient(name = "interaction-service", fallback = InteractionClientFallback.class)
public interface InteractionClient {

    // Renvoie {"count": X, ...}
    @GetMapping("/api/events/{id}/likes")
    Map<String, Object> getEventLikes(@PathVariable("id") Long id);

    // Renvoie {"count": X}
    @GetMapping("/api/events/{id}/participants/count")
    Map<String, Object> getParticipantsCount(@PathVariable("id") Long id);

    // Vérifie bien le nom : getEventComments
    @GetMapping("/api/events/{id}/comments")
    List<CommentSummaryDTO> getEventComments(@PathVariable("id") Long id);

    // AJOUT DE LA MÉTHODE MANQUANTE
    @PutMapping("/api/comments/{commentId}/hide")
    void hideComment(@PathVariable("commentId") Long commentId);
}