package com.social.interactionservice.services;

import com.social.interactionservice.entities.Comment;

import java.util.List;

public interface CommentService {

    Comment addComment(Long eventId, Long userId, String userName, String content);

    void deleteComment(Long commentId, Long userId);

    void hideComment(Long commentId); // for moderation (Personne 4)

    List<Comment> getComments(Long eventId);
}