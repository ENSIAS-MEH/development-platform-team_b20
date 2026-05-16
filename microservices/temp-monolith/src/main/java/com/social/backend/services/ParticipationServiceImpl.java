package com.social.eventservice.services;

import com.social.eventservice.entities.Event;
import com.social.eventservice.entities.Participation;
import com.social.eventservice.entities.User;
import com.social.eventservice.repositories.EventRepository;
import com.social.eventservice.repositories.ParticipationRepository;
import com.social.eventservice.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParticipationServiceImpl implements ParticipationService {

    @Autowired
    private ParticipationRepository participationRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public Participation joinEvent(Long eventId, Long userId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Already joined?
        if (participationRepo.findByUserAndEvent(user, event).isPresent()) {
            throw new RuntimeException("User already joined this event");
        }

        // Capacity full?
        long currentCount = participationRepo.countByEvent(event);
        if (currentCount >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }

        Participation participation = new Participation(user, event);
        return participationRepo.save(participation);
    }

    @Override
    @Transactional
    public void leaveEvent(Long eventId, Long userId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        participationRepo.deleteByUserAndEvent(user, event);
    }

    @Override
    public List<User> getParticipants(Long eventId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        return participationRepo.findByEvent(event).stream()
            .map(Participation::getUser)
            .collect(Collectors.toList());
    }

    @Override
    public long countParticipants(Long eventId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        return participationRepo.countByEvent(event);
    }
}