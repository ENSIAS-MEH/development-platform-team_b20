package com.social.recommendationservice.dto;

import lombok.Data;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String eventDate; // Doit être String pour recevoir le JSON
    private String category;
    private String imageBase64;
    private String organizerName;
}