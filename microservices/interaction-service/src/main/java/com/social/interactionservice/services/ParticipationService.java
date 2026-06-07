package com.social.interactionservice.services;

import com.social.interactionservice.entities.Participation;

import java.util.List;

public interface ParticipationService {

    Participation joinEvent(Long eventId, Long userId);

    void leaveEvent(Long eventId, Long userId);

    // Returns list of userIds who joined the event
    List<Long> getParticipantIds(Long eventId);

    long countParticipants(Long eventId);

    List<Long> getEventIdsByUser(Long userId);
}