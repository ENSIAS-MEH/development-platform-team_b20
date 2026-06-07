package com.social.eventservice.controllers;

import com.social.eventservice.dto.CreateEventRequest;
import com.social.eventservice.dto.EventResponseDTO;
import com.social.eventservice.services.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    private Long getCurrentUserId() {
        return 1L;
    }

    @PostMapping
    public ResponseEntity<EventResponseDTO> createEvent(@Valid @RequestBody CreateEventRequest request) {
        // Trust the frontend to send the organizer ID (MVP — no JWT validation here yet).
        // If not provided, fall back to the placeholder.
        Long organizerId = request.getOrganizerId() != null ? request.getOrganizerId() : getCurrentUserId();
        return new ResponseEntity<>(eventService.createEvent(request, organizerId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody CreateEventRequest request) {
        // MVP: frontend sends the acting user's ID; backend uses it for ownership check
        Long userId = request.getOrganizerId() != null ? request.getOrganizerId() : getCurrentUserId();
        return ResponseEntity.ok(eventService.updateEvent(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
        @PathVariable Long id,
        @RequestParam(required = false) Long userId
    ) {
        
    Long actorId = userId != null ? userId : getCurrentUserId();
    eventService.deleteEvent(id, actorId);
    return ResponseEntity.noContent().build();
}

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
}