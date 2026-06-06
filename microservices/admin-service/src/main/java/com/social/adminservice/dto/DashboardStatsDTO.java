package com.social.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data @AllArgsConstructor @NoArgsConstructor
public class DashboardStatsDTO {
    private Long totalUsers;
    private Long totalEvents;
    private Long totalInteractions;
    private double participationRate;
    private Map<String, Long> eventsByCategory;
    private Map<String, Long> eventsByCity;
    private List<Map<String, Object>> topLikedEvents;

    // --- AJOUTE CETTE LIGNE ICI ---
    private List<EventSummaryDTO> allEvents; 
}