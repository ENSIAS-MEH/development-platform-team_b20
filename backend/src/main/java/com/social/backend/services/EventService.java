package com.social.backend.services;

import com.social.backend.entities.Event;
import java.util.List;

public interface EventService {

    Event createEvent(Event event);

    Event updateEvent(Long id, Event event);

    void deleteEvent(Long id);

    Event getEventById(Long id);

    List<Event> getAllEvents();

    List<Event> searchEvents(String keyword);
}