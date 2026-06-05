package com.social.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id; // CORRECTION : Type String pour correspondre à l'entité
    private String email;
    private String fullName;
    private String bio;
    private Set<String> roles;
    private LocalDateTime createdAt;
}