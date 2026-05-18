package com.social.interactionservice.services;

import com.social.interactionservice.entities.EventLike;
import com.social.interactionservice.repositories.EventLikeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private EventLikeRepository likeRepo;

    @Override
    public void likeEvent(Long eventId, Long userId) {

        if (likeRepo.existsByUserIdAndEventId(userId, eventId)) {
            throw new RuntimeException("User already liked this event");
        }

        likeRepo.save(new EventLike(userId, eventId));
    }

    @Override
    @Transactional
    public void unlikeEvent(Long eventId, Long userId) {
        likeRepo.deleteByUserIdAndEventId(userId, eventId);
    }

    @Override
    public long countLikes(Long eventId) {
        return likeRepo.countByEventId(eventId);
    }

    @Override
    public boolean hasUserLiked(Long eventId, Long userId) {
        return likeRepo.existsByUserIdAndEventId(userId, eventId);
    }
}