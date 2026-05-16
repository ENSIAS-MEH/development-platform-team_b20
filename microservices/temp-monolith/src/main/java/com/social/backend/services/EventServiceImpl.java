package com.social.eventservice.services;

import com.social.eventservice.dto.CreateEventRequest;
import com.social.eventservice.dto.EventResponseDTO;
import com.social.eventservice.entities.Event;
import com.social.eventservice.entities.User;
import com.social.eventservice.repositories.EventRepository;
import com.social.eventservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public EventResponseDTO createEvent(CreateEventRequest request, Long organizerId) {
        // Vérifier si organizerId est null ou 0
        if (organizerId == null || organizerId == 0) {
            organizerId = 1L; // ID par défaut pour les tests
        }
        
        // Récupérer l'organisateur
        User organizer = userRepository.findById(organizerId)
            .orElseGet(() -> {
                // Créer un organisateur par défaut s'il n'existe pas
                User defaultOrganizer = new User();
                defaultOrganizer.setId(1L);
                defaultOrganizer.setEmail("default@organizer.com");
                defaultOrganizer.setName("Default Organizer");
                defaultOrganizer.setPassword("default");
                defaultOrganizer.setRole("ORGANIZER");
                return userRepository.save(defaultOrganizer);
            });
        
        // Créer l'événement
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        event.setOrganizer(organizer);
        
        // Validation supplémentaire
        if (event.getEventDate() != null && event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La date de l'événement ne peut pas être dans le passé");
        }
        
        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }
    
    @Override
    public EventResponseDTO updateEvent(Long id, CreateEventRequest request, Long userId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id: " + id));
        
        // Vérifier que l'utilisateur est l'organisateur
        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(userId)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à modifier cet événement");
        }
        
        // Vérifier que l'événement n'est pas passé
        if (event.getEventDate() != null && event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Impossible de modifier un événement passé");
        }
        
        // Mettre à jour les champs
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        
        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }
    
    @Override
    public void deleteEvent(Long id, Long userId, boolean isAdmin) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id: " + id));
        
        // Vérifier les permissions (admin ou organisateur)
        if (!isAdmin && (event.getOrganizer() == null || !event.getOrganizer().getId().equals(userId))) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à supprimer cet événement");
        }
        
        eventRepository.delete(event);
    }
    
    @Override
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id: " + id));
        return convertToDTO(event);
    }
    
    @Override
    public List<EventResponseDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<EventResponseDTO> searchEvents(String keyword, String category, String location, Boolean upcomingOnly) {
        boolean upcoming = upcomingOnly != null && upcomingOnly;
        List<Event> events = eventRepository.searchEvents(keyword, category, location, upcoming);
        return events.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<EventResponseDTO> getEventsByOrganizer(Long organizerId) {
        List<Event> events = eventRepository.findByOrganizerId(organizerId);
        return events.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Convertit une entité Event en DTO EventResponseDTO
     */
    private EventResponseDTO convertToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setCapacity(event.getCapacity());
        dto.setCategory(event.getCategory());
        
        // Gérer l'organisateur (peut être null)
        if (event.getOrganizer() != null) {
            dto.setOrganizerId(event.getOrganizer().getId());
            dto.setOrganizerName(event.getOrganizer().getName());
            dto.setOrganizerEmail(event.getOrganizer().getEmail());
        } else {
            dto.setOrganizerId(null);
            dto.setOrganizerName("Organisateur inconnu");
            dto.setOrganizerEmail("unknown@email.com");
        }
        
        // Calculer les propriétés dérivées
        dto.setFull(event.isFull());
        dto.setPast(event.isPast());
        
        return dto;
    }
}