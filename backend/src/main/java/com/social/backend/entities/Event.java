package com.social.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String location;

    private LocalDateTime date;

    private int capacity;

    private String category;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    public Event() {}

    // getters & setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getDate() { return date; }

    public void setDate(LocalDateTime date) { this.date = date; }

    public int getCapacity() { return capacity; }

    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public User getOrganizer() { return organizer; }

    public void setOrganizer(User organizer) { this.organizer = organizer; }
}