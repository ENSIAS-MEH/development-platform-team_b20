package com.social.eventservice.services;

import com.social.eventservice.dto.CreateEventRequest;
import com.social.eventservice.dto.EventResponseDTO;
import java.util.List;

public interface EventService {
    EventResponseDTO createEvent(CreateEventRequest request, Long organizerId);
    EventResponseDTO updateEvent(Long id, CreateEventRequest request, Long userId);
    void deleteEvent(Long id, Long userId);
    EventResponseDTO getEventById(Long id);
    List<EventResponseDTO> getAllEvents();
}