package com.social.recommendationservice.client;

import com.social.recommendationservice.dto.EventDTO;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class EventClientFallback implements EventClient {
    @Override
    public List<EventDTO> getAllEvents() {
        return new ArrayList<>(); // Renvoie une liste vide au lieu d'une erreur 500
    }
}