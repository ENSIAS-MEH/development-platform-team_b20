package com.social.userservice.controllers;

import com.social.userservice.dto.UserProfileUpdateDto;
import com.social.userservice.dto.UserResponseDto;
import com.social.userservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Route GET : Permet à l'utilisateur connecté de voir son propre profil.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUserProfile(Principal principal) {
        // La magie de Spring Security : 'principal' contient l'email extrait du token JWT valide !
        String userEmail = principal.getName();
        return ResponseEntity.ok(userService.getUserProfile(userEmail));
    }

    /**
     * Route PUT : Permet à l'utilisateur de modifier son profil.
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateProfile(
            Principal principal,
            @RequestBody UserProfileUpdateDto updateDto) {
        
        String userEmail = principal.getName();
        return ResponseEntity.ok(userService.updateUserProfile(userEmail, updateDto));
    }
}