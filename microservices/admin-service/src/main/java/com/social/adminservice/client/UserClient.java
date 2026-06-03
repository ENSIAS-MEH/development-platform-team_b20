package com.social.adminservice.client;

import com.social.adminservice.dto.UserSummaryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "user-service", fallback = UserClientFallback.class)
public interface UserClient {

    @GetMapping("/api/users")
    List<UserSummaryDTO> getAllUsers();

    @GetMapping("/api/users/count")
    Long countUsers();

    @PatchMapping("/api/users/{id}/status")
    void updateUserStatus(@PathVariable("id") Long id, @RequestParam("status") String status);

    @PatchMapping("/api/users/{id}/role")
    void updateUserRole(@PathVariable("id") Long id, @RequestParam("role") String role);
}