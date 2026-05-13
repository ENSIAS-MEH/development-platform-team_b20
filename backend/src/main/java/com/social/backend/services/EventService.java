package com.social.backend.services;

import com.social.backend.dto.CreateEventRequest;
import com.social.backend.dto.EventResponseDTO;
import java.util.List;

public interface EventService {
    EventResponseDTO createEvent(CreateEventRequest request, Long organizerId);
    EventResponseDTO updateEvent(Long id, CreateEventRequest request, Long userId);
    void deleteEvent(Long id, Long userId, boolean isAdmin);
    EventResponseDTO getEventById(Long id);
    List<EventResponseDTO> getAllEvents();
    List<EventResponseDTO> searchEvents(String keyword, String category, String location, Boolean upcomingOnly);
    List<EventResponseDTO> getEventsByOrganizer(Long organizerId);
}