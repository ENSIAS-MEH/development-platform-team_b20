package com.social.eventservice.dto;

import java.time.LocalDateTime;

public class CreateEventRequest {
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
    private String category;

    // Getters
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getEventDate() { return eventDate; }
    public Integer getCapacity() { return capacity; }
    public String getCategory() { return category; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setCategory(String category) { this.category = category; }
}