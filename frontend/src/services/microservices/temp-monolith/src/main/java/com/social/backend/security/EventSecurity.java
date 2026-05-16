package com.social.backend.security;

import com.social.backend.entities.Event;
import com.social.backend.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class EventSecurity {
    
    @Autowired
    private EventRepository eventRepository;
    
    // Vérifier si l'utilisateur est l'organisateur de l'événement
    public boolean isOwner(Long eventId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return false;
        
        String currentUserEmail = auth.getName();
        return event.getOrganizer() != null && 
               event.getOrganizer().getEmail().equals(currentUserEmail);
    }
    
    // Vérifier si l'utilisateur est admin
    public boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        
        return auth.getAuthorities().stream()
            .anyMatch(granted -> granted.getAuthority().equals("ROLE_ADMIN"));
    }
    
    // Vérifier si peut modifier (organisateur ou admin)
    public boolean canModify(Long eventId, Authentication auth) {
        return isOwner(eventId, auth) || isAdmin(auth);
    }
}