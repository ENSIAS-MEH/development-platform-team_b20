package com.social.userservice.services;

import com.social.userservice.dto.AuthResponse;
import com.social.userservice.dto.LoginRequest;
import com.social.userservice.dto.RegisterRequest;
import com.social.userservice.entities.User;
import com.social.userservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // hash it!
        user.setFullName(request.getFullName());
        user.setRole("USER"); // default role; admins are promoted manually in DB

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, saved.getId(), saved.getEmail(), saved.getFullName(), saved.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}