package com.social.interactionservice.controllers;

import com.social.interactionservice.entities.Comment;
import com.social.interactionservice.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/api/events/{eventId}/comments")
    public ResponseEntity<?> addComment(
        @PathVariable Long eventId,
        @RequestParam Long userId,
        @RequestParam(required = false) String userName,
        @RequestBody Map<String, String> body
    ) {
        String content = body.get("content");
        return ResponseEntity.ok(commentService.addComment(eventId, userId, userName, content));
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