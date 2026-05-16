package com.social.eventservice.repositories;

import com.social.eventservice.entities.Event;
import com.social.eventservice.entities.Participation;
import com.social.eventservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    // Find a specific participation (used to check if a user already joined)
    Optional<Participation> findByUserAndEvent(User user, Event event);

    // List all participants of an event
    List<Participation> findByEvent(Event event);

    // List all events a user has joined
    List<Participation> findByUser(User user);

    // Count participants (for capacity check)
    long countByEvent(Event event);

    // Delete a participation by user + event (for leaving)
    void deleteByUserAndEvent(User user, Event event);
}