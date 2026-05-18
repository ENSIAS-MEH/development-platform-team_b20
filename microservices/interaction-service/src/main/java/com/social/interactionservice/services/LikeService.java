package com.social.interactionservice.services;

public interface LikeService {

    void likeEvent(Long eventId, Long userId);

    void unlikeEvent(Long eventId, Long userId);

    long countLikes(Long eventId);

    boolean hasUserLiked(Long eventId, Long userId);
}