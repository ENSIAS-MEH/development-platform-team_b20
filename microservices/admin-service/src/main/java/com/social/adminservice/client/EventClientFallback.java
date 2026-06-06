package com.social.adminservice.client;

import com.social.adminservice.dto.EventSummaryDTO;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;

@Component
public class EventClientFallback implements EventClient {
    @Override
    public List<EventSummaryDTO> getAllEvents() {
        return Collections.emptyList(); 
    }
    
    @Override
    public void deleteEvent(Long id) {
        // Logique : On ne peut pas supprimer si le service est mort
        System.out.println("Impossible de supprimer : le service Event est HS");
    }
}