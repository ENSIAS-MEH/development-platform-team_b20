package com.social.interactionservice.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "event_likes",
    schema = "interactions_schema",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"})
)
public class EventLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public EventLike() {}

    public EventLike(Long userId, Long eventId) {
        this.userId = userId;
        this.eventId = eventId;
        this.createdAt = LocalDateTime.now();
    }

    // Getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}