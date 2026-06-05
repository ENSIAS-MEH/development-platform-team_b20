package com.social.userservice.repositories;

import com.social.userservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> { // <-- BIEN METTRE Long ICI
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email); 
}