package com.social.recommendationservice.client;

import com.social.recommendationservice.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserClientFallback implements UserClient {
    @Override
    public UserDTO getUserById(Long id) {
        return null; // Si l'user n'est pas trouvé, l'IA s'arrête proprement
    }
}