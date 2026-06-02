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
        event.setImageBase64(request.getImageBase64());
        event.setOrganizerId(organizerId);

        Event saved = eventRepository.save(event);

        return toDTO(saved);
    }

    @Override
    public EventResponseDTO updateEvent(Long id, CreateEventRequest request, Long userId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        if (!event.getOrganizerId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cet événement");
        }

        if (event.getEventDate() != null && event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Impossible de modifier un événement passé");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());

        // Image logic:
        // - removeImage = true  → delete the existing image
        // - new imageBase64 present → replace
        // - imageBase64 empty/null and no removeImage flag → keep existing
        if (Boolean.TRUE.equals(request.getRemoveImage())) {
            event.setImageBase64(null);
        } else if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
            event.setImageBase64(request.getImageBase64());
        }

        Event updated = eventRepository.save(event);

        return toDTO(updated);
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
        return toDTO(event);
    }

    @Override
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    // Helper: Event entity → DTO (extracted to one place for consistency)
    private EventResponseDTO toDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setCapacity(event.getCapacity());
        dto.setCategory(event.getCategory());
        dto.setImageBase64(event.getImageBase64());
        dto.setOrganizerId(event.getOrganizerId());
        dto.setOrganizerName("Organisateur");
        return dto;
    }
}