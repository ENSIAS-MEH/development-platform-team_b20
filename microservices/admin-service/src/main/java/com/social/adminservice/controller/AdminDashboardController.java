package com.social.adminservice.controller;

import com.social.adminservice.dto.DashboardStatsDTO;
import com.social.adminservice.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
}