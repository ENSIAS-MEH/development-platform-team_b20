package com.social.recommendationservice.controller;

import com.social.recommendationservice.dto.RecommendationResponseDTO;
import com.social.recommendationservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    // URL : http://localhost:8080/recommendation-service/api/recommendations/user/1
    @GetMapping("/user/{userId}")
    public List<RecommendationResponseDTO> getRecs(@PathVariable Long userId) {
        return recommendationService.getRecommendationsForUser(userId);
    }
}