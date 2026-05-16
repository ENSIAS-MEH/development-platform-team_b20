package com.social.backend.services;

import com.social.backend.entities.Comment;
import java.util.List;

public interface CommentService {

    Comment addComment(Long eventId, Long userId, String content);

    void deleteComment(Long commentId, Long userId);

    void hideComment(Long commentId); // for moderation (Personne 4)

    List<Comment> getComments(Long eventId);
}