package com.social.interactionservice.services;

import com.social.interactionservice.entities.Comment;
import com.social.interactionservice.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepo;

    @Override
    public Comment addComment(Long eventId, Long userId, String content) {

        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment cannot be empty");
        }

        if (content.length() > 1000) {
            throw new RuntimeException("Comment too long (max 1000 chars)");
        }

        Comment comment = new Comment(content.trim(), userId, eventId);
        return commentRepo.save(comment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId) {

        Comment comment = commentRepo.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));

        // Only the author can delete their own comment
        if (!comment.getAuthorId().equals(userId)) {
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
        // Public view: only visible comments
        return commentRepo.findByEventIdAndStatusOrderByCreatedAtDesc(eventId, "VISIBLE");
    }
}