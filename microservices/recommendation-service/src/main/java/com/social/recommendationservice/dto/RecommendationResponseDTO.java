package com.social.recommendationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationResponseDTO {
    private Long eventId;
    private String title;
    private String description;
    private String location;
    private String eventDate;
    private String category;
    private String imageBase64;
    private String organizerName;
    private Double score;
    private String reason;
}