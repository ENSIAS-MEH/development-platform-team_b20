package com.social.adminservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    // Renvoie une liste [ {...}, {...} ]
    @GetMapping("/api/events/{id}/comments")
    List<Object> getEventComments(@PathVariable("id") Long id);
}