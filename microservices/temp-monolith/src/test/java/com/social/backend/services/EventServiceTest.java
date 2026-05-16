package com.social.eventservice.services;

import com.social.eventservice.entities.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EventServiceTest {

    @Autowired
    private EventService eventService;

    @Test
    public void testCreateEvent() {

        Event event = new Event();
        event.setTitle("Test Event");

        Event saved = eventService.createEvent(event);

        assertNotNull(saved);
        assertNotNull(saved.getId());
    }
}