package com.social.backend.repositories;

import com.social.backend.entities.Comment;
import com.social.backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByEventAndStatusOrderByCreatedAtDesc(Event event, String status);

    List<Comment> findByEventOrderByCreatedAtDesc(Event event);
}