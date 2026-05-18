package com.social.interactionservice.repositories;

import com.social.interactionservice.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Public view: only VISIBLE comments, newest first
    List<Comment> findByEventIdAndStatusOrderByCreatedAtDesc(Long eventId, String status);

    // Admin view: all comments (visible + hidden), newest first
    List<Comment> findByEventIdOrderByCreatedAtDesc(Long eventId);
}