package com.social.eventservice.services;

import com.social.eventservice.dto.CreateEventRequest;
import com.social.eventservice.dto.EventResponseDTO;
import com.social.eventservice.entities.Event;
import com.social.eventservice.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public EventResponseDTO createEvent(CreateEventRequest request, Long organizerId) {
        // Vérifier que la date est dans le futur
        if (request.getEventDate() != null && request.getEventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La date de l'événement ne peut pas être dans le passé");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        event.setOrganizerId(organizerId);
        
        Event saved = eventRepository.save(event);
        
        EventResponseDTO response = new EventResponseDTO();
        response.setId(saved.getId());
        response.setTitle(saved.getTitle());
        response.setDescription(saved.getDescription());
        response.setLocation(saved.getLocation());
        response.setEventDate(saved.getEventDate());
        response.setCapacity(saved.getCapacity());
        response.setCategory(saved.getCategory());
        response.setOrganizerId(organizerId);
        response.setOrganizerName("Organisateur");
        
        return response;
    }

    @Override
    public EventResponseDTO updateEvent(Long id, CreateEventRequest request, Long userId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        // Vérifier que l'utilisateur est l'organisateur
        if (!event.getOrganizerId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cet événement");
        }
        
        // Vérifier que l'événement n'est pas passé
        if (event.getEventDate() != null && event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Impossible de modifier un événement passé");
        }
        
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        
        Event updated = eventRepository.save(event);
        
        EventResponseDTO response = new EventResponseDTO();
        response.setId(updated.getId());
        response.setTitle(updated.getTitle());
        response.setDescription(updated.getDescription());
        response.setLocation(updated.getLocation());
        response.setEventDate(updated.getEventDate());
        response.setCapacity(updated.getCapacity());
        response.setCategory(updated.getCategory());
        response.setOrganizerId(updated.getOrganizerId());
        response.setOrganizerName("Organisateur");
        
        return response;
    }

    @Override
    public void deleteEvent(Long id, Long userId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        if (!event.getOrganizerId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cet événement");
        }
        
        eventRepository.delete(event);
    }

    @Override
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        
        EventResponseDTO response = new EventResponseDTO();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
        response.setEventDate(event.getEventDate());
        response.setCapacity(event.getCapacity());
        response.setCategory(event.getCategory());
        response.setOrganizerId(event.getOrganizerId());
        response.setOrganizerName("Organisateur");
        
        return response;
    }

    @Override
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll().stream().map(event -> {
            EventResponseDTO dto = new EventResponseDTO();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setLocation(event.getLocation());
            dto.setEventDate(event.getEventDate());
            dto.setCapacity(event.getCapacity());
            dto.setCategory(event.getCategory());
            dto.setOrganizerId(event.getOrganizerId());
            dto.setOrganizerName("Organisateur");
            return dto;
        }).collect(Collectors.toList());
    }
}