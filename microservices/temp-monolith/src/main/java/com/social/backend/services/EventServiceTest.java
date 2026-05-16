package com.social.eventservice.services;

import com.social.eventservice.dto.CreateEventRequest;
import com.social.eventservice.dto.EventResponseDTO;
import com.social.eventservice.entities.User;
import com.social.eventservice.repositories.EventRepository;
import com.social.eventservice.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {
    
    @Mock
    private EventRepository eventRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private EventServiceImpl eventService;
    
    private User organizer;
    private CreateEventRequest createRequest;
    
    @BeforeEach
    void setUp() {
        organizer = new User();
        organizer.setId(1L);
        organizer.setEmail("organizer@test.com");
        organizer.setName("Organizer");
        
        createRequest = new CreateEventRequest();
        createRequest.setTitle("Test Event");
        createRequest.setDescription("Test Description");
        createRequest.setLocation("Test Location");
        createRequest.setEventDate(LocalDateTime.now().plusDays(7));
        createRequest.setCapacity(100);
        createRequest.setCategory("Conference");
    }
    
    @Test
    void testCreateEvent_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(organizer));
        
        assertDoesNotThrow(() -> eventService.createEvent(createRequest, 1L));
        verify(eventRepository, times(1)).save(any());
    }
    
    @Test
    void testCreateEvent_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> eventService.createEvent(createRequest, 1L));
    }
    
    @Test
    void testDeleteEvent_NotOwner_ThrowsAccessDenied() {
        Long eventId = 1L;
        Long otherUserId = 2L;
        
        assertThrows(AccessDeniedException.class, 
            () -> eventService.deleteEvent(eventId, otherUserId, false));
    }
}