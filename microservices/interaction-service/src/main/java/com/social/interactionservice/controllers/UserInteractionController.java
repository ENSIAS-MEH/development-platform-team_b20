package com.social.interactionservice.controllers;

import com.social.interactionservice.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User-centric queries: "what has this user participated in?"
 * Separated from ParticipationController (which is event-centric).
 */
@RestController
@RequestMapping("/api/users")
public class UserInteractionController {

    @Autowired
    private ParticipationService participationService;

    /**
     * GET /api/users/{userId}/participations
     * Returns the list of event IDs the user has joined.
     */
    @GetMapping("/{userId}/participations")
    public ResponseEntity<List<Long>> getUserParticipations(@PathVariable Long userId) {
        return ResponseEntity.ok(participationService.getEventIdsByUser(userId));
    }
}