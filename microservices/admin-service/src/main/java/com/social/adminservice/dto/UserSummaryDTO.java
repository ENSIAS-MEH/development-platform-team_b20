package com.social.adminservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserSummaryDTO {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private List<String> interests;
}