package com.social.userservice.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "users", schema = "users_schema") 
@Getter @Setter 
@NoArgsConstructor @AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String fullName;
    private String role;

    @ElementCollection
    private List<String> interests;

}