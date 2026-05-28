package com.social.interactionservice.controllers;

import com.social.interactionservice.entities.Comment;
import com.social.interactionservice.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // TODO: replace userId param with authenticated user once JWT is in place
    @PostMapping("/api/events/{eventId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long eventId,
            @RequestParam Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String content = body.get("content");
            Comment comment = commentService.addComment(eventId, userId, content);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/events/{eventId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long eventId) {
        return ResponseEntity.ok(commentService.getComments(eventId));
    }

    // TODO: replace userId param with authenticated user once JWT is in place
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        try {
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // For moderation — eventually restricted to admins
    @PutMapping("/api/comments/{commentId}/hide")
    public ResponseEntity<?> hideComment(@PathVariable Long commentId) {
        try {
            commentService.hideComment(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment hidden"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}