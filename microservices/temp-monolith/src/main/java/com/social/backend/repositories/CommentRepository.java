package com.social.eventservice.repositories;

import com.social.eventservice.entities.Comment;
import com.social.eventservice.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByEventAndStatusOrderByCreatedAtDesc(Event event, String status);

    List<Comment> findByEventOrderByCreatedAtDesc(Event event);
}