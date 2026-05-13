package com.social.backend.repositories;

import com.social.backend.entities.Event;
import com.social.backend.entities.EventLike;
import com.social.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventLikeRepository extends JpaRepository<EventLike, Long> {

    // Check if a user already liked an event
    Optional<EventLike> findByUserAndEvent(User user, Event event);

    // Count likes for an event
    long countByEvent(Event event);

    // For unliking
    void deleteByUserAndEvent(User user, Event event);

    // Check if user liked (returns true/false directly)
    boolean existsByUserAndEvent(User user, Event event);
}