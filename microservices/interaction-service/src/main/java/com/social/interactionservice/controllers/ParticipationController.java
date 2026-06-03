package com.social.interactionservice.controllers;

import com.social.interactionservice.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events") 
public class ParticipationController {

    @Autowired
    private ParticipationService participationService;

    // TODO: replace userId param with authenticated user once JWT is in place
    @PostMapping("/{eventId}/join")
    public ResponseEntity<?> join(@PathVariable Long eventId, @RequestParam Long userId) {
        try {
            participationService.joinEvent(eventId, userId);
            return ResponseEntity.ok(Map.of("message", "Joined event successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // TODO: replace userId param with authenticated user once JWT is in place
    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<?> leave(@PathVariable Long eventId, @RequestParam Long userId) {
        try {
            participationService.leaveEvent(eventId, userId);
            return ResponseEntity.ok(Map.of("message", "Left event successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Returns list of user IDs (frontend can fetch user details from user-service if needed)
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<Long>> getParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(participationService.getParticipantIds(eventId));
    }

    @GetMapping("/{eventId}/participants/count")
    public ResponseEntity<?> countParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(Map.of("count", participationService.countParticipants(eventId)));
    }
}