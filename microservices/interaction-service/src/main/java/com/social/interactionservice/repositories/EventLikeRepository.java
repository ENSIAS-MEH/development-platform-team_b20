package com.social.interactionservice.repositories;

import com.social.interactionservice.entities.EventLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventLikeRepository extends JpaRepository<EventLike, Long> {

    // Check if a user already liked an event
    Optional<EventLike> findByUserIdAndEventId(Long userId, Long eventId);

    // Count likes for an event
    long countByEventId(Long eventId);

    // For unliking
    void deleteByUserIdAndEventId(Long userId, Long eventId);

    // Quick existence check (returns true/false directly, faster than fetching)
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}