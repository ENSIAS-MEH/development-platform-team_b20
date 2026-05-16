package com.social.eventservice.services;

import com.social.eventservice.entities.Participation;
import com.social.eventservice.entities.User;

import java.util.List;

public interface ParticipationService {

    Participation joinEvent(Long eventId, Long userId);

    void leaveEvent(Long eventId, Long userId);

    List<User> getParticipants(Long eventId);

    long countParticipants(Long eventId);
}