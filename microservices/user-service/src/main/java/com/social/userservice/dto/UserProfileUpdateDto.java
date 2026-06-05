package com.social.userservice.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserProfileUpdateDto {
    private String fullName;
    private String bio;
    
    // Les centres d'intérêt que l'utilisateur souhaite définir
    private Set<String> interests;
}