package com.social.interactionservice.controllers;

import com.social.interactionservice.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class LikeController {

    @Autowired
    private LikeService likeService;

    // TODO: replace userId param with authenticated user once JWT is in place
    @PostMapping("/{eventId}/like")
    public ResponseEntity<?> like(@PathVariable Long eventId, @RequestParam Long userId) {
        try {
            likeService.likeEvent(eventId, userId);
            return ResponseEntity.ok(Map.of("message", "Event liked"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // TODO: replace userId param with authenticated user once JWT is in place
    @DeleteMapping("/{eventId}/like")
    public ResponseEntity<?> unlike(@PathVariable Long eventId, @RequestParam Long userId) {
        try {
            likeService.unlikeEvent(eventId, userId);
            return ResponseEntity.ok(Map.of("message", "Event unliked"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Returns count + whether the current user has liked it
    @GetMapping("/{eventId}/likes")
    public ResponseEntity<?> getLikes(
            @PathVariable Long eventId,
            @RequestParam(required = false) Long userId) {

        long count = likeService.countLikes(eventId);
        boolean liked = userId != null && likeService.hasUserLiked(eventId, userId);

        return ResponseEntity.ok(Map.of(
            "count", count,
            "likedByCurrentUser", liked
        ));
    }
}