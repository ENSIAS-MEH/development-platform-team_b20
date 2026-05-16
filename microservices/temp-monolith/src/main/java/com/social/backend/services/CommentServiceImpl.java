package com.social.eventservice.services;

import com.social.eventservice.entities.Comment;
import com.social.eventservice.entities.Event;
import com.social.eventservice.entities.User;
import com.social.eventservice.repositories.CommentRepository;
import com.social.eventservice.repositories.EventRepository;
import com.social.eventservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public Comment addComment(Long eventId, Long userId, String content) {

        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment cannot be empty");
        }

        if (content.length() > 1000) {
            throw new RuntimeException("Comment too long (max 1000 chars)");
        }

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Comment comment = new Comment(content.trim(), user, event);
        return commentRepo.save(comment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId) {

        Comment comment = commentRepo.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));

        // Only the author can delete (TODO: allow admins once role check is wired)
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepo.delete(comment);
    }

    @Override
    public void hideComment(Long commentId) {

        Comment comment = commentRepo.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));

        comment.setStatus("HIDDEN");
        commentRepo.save(comment);
    }

    @Override
    public List<Comment> getComments(Long eventId) {

        Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        // Public view: only visible comments
        return commentRepo.findByEventAndStatusOrderByCreatedAtDesc(event, "VISIBLE");
    }
}