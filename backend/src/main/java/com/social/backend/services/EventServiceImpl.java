package com.social.backend.services;

import com.social.backend.entities.Event;
import com.social.backend.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository repo;

    @Override
    public Event createEvent(Event event) {
        return repo.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event event) {
        Event existing = repo.findById(id).orElseThrow();

        existing.setTitle(event.getTitle());
        existing.setDescription(event.getDescription());
        existing.setLocation(event.getLocation());
        existing.setDate(event.getDate());
        existing.setCapacity(event.getCapacity());
        existing.setCategory(event.getCategory());

        return repo.save(existing);
    }

    @Override
    public void deleteEvent(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Event getEventById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public List<Event> getAllEvents() {
        return repo.findAll();
    }

    @Override
    public List<Event> searchEvents(String keyword) {
        return repo.findByTitleContaining(keyword);
    }
}