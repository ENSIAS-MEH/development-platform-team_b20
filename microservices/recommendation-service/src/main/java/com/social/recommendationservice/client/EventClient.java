package com.social.recommendationservice.client;

import com.social.recommendationservice.dto.EventDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "event-service")
public interface EventClient {
    @GetMapping("/api/events")
    List<EventDTO> getAllEvents();
}