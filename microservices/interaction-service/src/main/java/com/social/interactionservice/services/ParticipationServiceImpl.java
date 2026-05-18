package com.social.interactionservice.services;

import com.social.interactionservice.entities.Participation;
import com.social.interactionservice.repositories.ParticipationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParticipationServiceImpl implements ParticipationService {

    @Autowired
    private ParticipationRepository participationRepo;

    // TODO: capacity check requires Event info. For now we skip it.
    // When EventProxy is added, fetch the event and compare against capacity.
    private static final long DEFAULT_CAPACITY = 1000;

    @Override
    public Participation joinEvent(Long eventId, Long userId) {

        // Already joined?
        if (participationRepo.findByUserIdAndEventId(userId, eventId).isPresent()) {
            throw new RuntimeException("User already joined this event");
        }

        // Capacity check (using default until EventProxy is wired)
        long currentCount = participationRepo.countByEventId(eventId);
        if (currentCount >= DEFAULT_CAPACITY) {
            throw new RuntimeException("Event is full");
        }

        Participation participation = new Participation(userId, eventId);
        return participationRepo.save(participation);
    }

    @Override
    @Transactional
    public void leaveEvent(Long eventId, Long userId) {
        participationRepo.deleteByUserIdAndEventId(userId, eventId);
    }

    @Override
    public List<Long> getParticipantIds(Long eventId) {
        return participationRepo.findByEventId(eventId).stream()
            .map(Participation::getUserId)
            .collect(Collectors.toList());
    }

    @Override
    public long countParticipants(Long eventId) {
        return participationRepo.countByEventId(eventId);
    }
}