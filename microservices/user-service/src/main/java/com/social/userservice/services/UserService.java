package com.social.userservice.services;

import com.social.userservice.dto.UserProfileUpdateDto;
import com.social.userservice.dto.UserRegistrationDto;
import com.social.userservice.dto.UserResponseDto;
import com.social.userservice.entities.User;
import com.social.userservice.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Ajouté pour hacher le mot de passe à l'inscription

    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        User newUser = User.builder()
                .email(registrationDto.getEmail())
                .password(passwordEncoder.encode(registrationDto.getPassword())) // Sécurisation du mot de passe
                .fullName(registrationDto.getFullName())
                .roles(new HashSet<>()) 
                .interests(new HashSet<>())
                .build();

        // Par défaut, on peut donner le rôle USER
        newUser.getRoles().add("USER");

        User savedUser = userRepository.save(newUser);

        return buildUserResponseDto(savedUser);
    }

    public UserResponseDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        return buildUserResponseDto(user);
    }

    public UserResponseDto updateUserProfile(String email, UserProfileUpdateDto updateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        user.setFullName(updateDto.getFullName());
        user.setBio(updateDto.getBio());
        
        User savedUser = userRepository.save(user);

        return buildUserResponseDto(savedUser);
    }

    private UserResponseDto buildUserResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                // On passe les rôles directement (en convertissant en List si ton DTO l'exige)
                .roles(user.getRoles() != null ? new ArrayList<>(user.getRoles()) : new ArrayList<>())
                .build();
    }
}