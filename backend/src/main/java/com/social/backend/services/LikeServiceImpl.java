package com.social.backend.services;

import com.social.backend.entities.Event;
import com.social.backend.entities.EventLike;
import com.social.backend.entities.User;
import com.social.backend.repositories.EventLikeRepository;
import com.social.backend.repositories.EventRepository;
import com.social.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private EventLikeRepository likeRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public void likeEvent(Long eventId, Long userId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (likeRepo.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("User already liked this event");
        }

        likeRepo.save(new EventLike(user, event));
    }

    @Override
    @Transactional
    public void unlikeEvent(Long eventId, Long userId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        likeRepo.deleteByUserAndEvent(user, event);
    }

    @Override
    public long countLikes(Long eventId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        return likeRepo.countByEvent(event);
    }

    @Override
    public boolean hasUserLiked(Long eventId, Long userId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return likeRepo.existsByUserAndEvent(user, event);
    }
}