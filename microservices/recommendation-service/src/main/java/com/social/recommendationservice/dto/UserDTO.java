package com.social.recommendationservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private List<String> interests; // C'est ici que se trouve la clé de ton IA
}