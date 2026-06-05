package com.social.userservice.repositories;

import com.social.userservice.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    // Utile pour attribuer un rôle spécifique lors de l'inscription
    Optional<Role> findByName(String name);
}