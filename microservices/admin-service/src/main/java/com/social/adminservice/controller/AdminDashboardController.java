package com.social.adminservice.controller;

import com.social.adminservice.dto.CommentSummaryDTO;
import com.social.adminservice.dto.DashboardStatsDTO;
import com.social.adminservice.service.DashboardService;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        // Appelle le service d'agrégation que nous venons de créer
        return dashboardService.getGlobalDashboardData();
    }
    @GetMapping("/comments") 
    public List<CommentSummaryDTO> getAllComments() {
        return dashboardService.getAllCommentsForModeration();
    }

    @PutMapping("/comments/{id}/hide")
    public void hideComment(@PathVariable Long id) {
        // ON APPELLE LE SERVICE ET PAS LE CLIENT DIRECTEMENT
        dashboardService.hideCommentViaInteractionService(id);
    }
}