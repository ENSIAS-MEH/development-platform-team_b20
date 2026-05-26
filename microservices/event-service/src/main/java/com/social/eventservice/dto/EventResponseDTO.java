package com.social.eventservice.dto;

import java.time.LocalDateTime;

public class EventResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
    private String category;
    private Long organizerId;
    private String organizerName;

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getEventDate() { return eventDate; }
    public Integer getCapacity() { return capacity; }
    public String getCategory() { return category; }
    public Long getOrganizerId() { return organizerId; }
    public String getOrganizerName() { return organizerName; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setCategory(String category) { this.category = category; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
}