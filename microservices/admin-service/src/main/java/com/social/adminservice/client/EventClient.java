package com.social.adminservice.client;

import com.social.adminservice.dto.EventSummaryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "event-service", fallback = EventClientFallback.class)
public interface EventClient {

    @GetMapping("/api/events")
    List<EventSummaryDTO> getAllEvents();

    @DeleteMapping("/api/events/{id}")
    void deleteEvent(@PathVariable("id") Long id);
}