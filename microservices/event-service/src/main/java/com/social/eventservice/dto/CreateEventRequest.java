package com.social.eventservice.dto;

import java.time.LocalDateTime;

public class CreateEventRequest {
    private Long organizerId;
    private String organizerName;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
    private String category;
    private String imageBase64;
    private Boolean removeImage; // true = delete the existing image (for edits)

    // Getters
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getEventDate() { return eventDate; }
    public Integer getCapacity() { return capacity; }
    public String getCategory() { return category; }
    public String getImageBase64() { return imageBase64; }
    public Boolean getRemoveImage() { return removeImage; }
    public Long getOrganizerId() { return organizerId; }
    public String getOrganizerName() { return organizerName; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setCategory(String category) { this.category = category; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
    public void setRemoveImage(Boolean removeImage) { this.removeImage = removeImage; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
}