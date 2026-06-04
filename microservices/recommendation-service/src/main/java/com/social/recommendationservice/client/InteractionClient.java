package com.social.recommendationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Map;

@FeignClient(name = "interaction-service")
public interface InteractionClient {

    // Pour savoir si l'user participe déjà (on ne lui recommande pas ce qu'il a déjà rejoint)
    @GetMapping("/api/events/{eventId}/participants")
    List<Long> getParticipantIds(@PathVariable("eventId") Long eventId);

    // Pour le score (P * 0.8)
    @GetMapping("/api/events/{eventId}/participants/count")
    Map<String, Object> getParticipantsCount(@PathVariable("eventId") Long eventId);

    // Pour le score (L * 0.2)
    @GetMapping("/api/events/{eventId}/likes")
    Map<String, Object> getLikesCount(@PathVariable("eventId") Long eventId);

    // Pour le score (C * 0.2)
    @GetMapping("/api/events/{eventId}/comments")
    List<Object> getComments(@PathVariable("eventId") Long eventId);
}