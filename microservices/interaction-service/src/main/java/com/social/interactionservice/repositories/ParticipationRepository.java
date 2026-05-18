package com.social.interactionservice.repositories;

import com.social.interactionservice.entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    // Find a specific participation (to check if user already joined)
    Optional<Participation> findByUserIdAndEventId(Long userId, Long eventId);

    // List all participants of an event (returns Participation rows; we'll extract userIds in service)
    List<Participation> findByEventId(Long eventId);

    // List all events a user has joined
    List<Participation> findByUserId(Long userId);

    // Count participants of an event (for capacity check)
    long countByEventId(Long eventId);

    // Delete a participation (for leaving)
    void deleteByUserIdAndEventId(Long userId, Long eventId);
}