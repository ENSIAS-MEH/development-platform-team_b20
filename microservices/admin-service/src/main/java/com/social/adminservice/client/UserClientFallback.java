package com.social.adminservice.client;

import com.social.adminservice.dto.UserSummaryDTO;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;

@Component
public class UserClientFallback implements UserClient {
    @Override
    public List<UserSummaryDTO> getAllUsers() {
        return Collections.emptyList(); 
    }

    @Override
    public Long countUsers() {
        return 0L; 
    }

    @Override
    public void updateUserStatus(Long id, String status) {}
    @Override
    public void updateUserRole(Long id, String role) {}
}