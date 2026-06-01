package com.social.eventservice.proxies;

import org.springframework.stereotype.Component;

@Component
public class UserFallback implements UserProxy {
    @Override
    public UserDTO getUserById(Long id) {
        return new UserDTO(id, "Indisponible", "unknown@email.com");
    }
}