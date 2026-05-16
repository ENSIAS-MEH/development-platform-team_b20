package com.social.eventservice.services;

import com.social.eventservice.dto.CreateEventRequest;
import com.social.eventservice.dto.EventResponseDTO;
import com.social.eventservice.entities.Event;
import com.social.eventservice.repositories.EventRepository;
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
    
    // MICROSERVICES : On a supprimé UserRepository ici !

    @Override
    public EventResponseDTO createEvent(CreateEventRequest request, Long organizerId) {
        // Si pas d'ID, on met 1 par défaut pour le moment
        if (organizerId == null || organizerId == 0) {
            organizerId = 1L;
        }
        
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        
        // On stocke juste l'ID
        event.setOrganizerId(organizerId);
        
        if (event.getEventDate() != null && event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La date de l'événement ne peut pas être dans le passé");
        }
        
        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }
    
    @Override
    public EventResponseDTO updateEvent(Long id, CreateEventRequest request, Long userId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        // Vérifier que l'utilisateur est bien l'organisateur (via son ID)
        if (!event.getOrganizerId().equals(userId)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à modifier cet événement");
        }
        
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
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        if (!isAdmin && !event.getOrganizerId().equals(userId)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à supprimer");
        }
        
        eventRepository.delete(event);
    }

    @Override
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        return convertToDTO(event);
    }

    @Override
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDTO> searchEvents(String keyword, String category, String location, Boolean upcomingOnly) {
        boolean upcoming = upcomingOnly != null && upcomingOnly;
        return eventRepository.searchEvents(keyword, category, location, upcoming).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDTO> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private EventResponseDTO convertToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setCapacity(event.getCapacity());
        dto.setCategory(event.getCategory());
        
        // On ne renvoie que l'ID de l'organisateur
        dto.setOrganizerId(event.getOrganizerId());
        dto.setOrganizerName("ID: " + event.getOrganizerId()); // Provisoire
        
        dto.setPast(event.isPast());
        // Note : .isFull() a été supprimé pour simplifier le passage microservices
        
        return dto;
    }
}