package com.social.adminservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventSummaryDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
    private String category;
    private Long organizerId;
    private String organizerName;
}