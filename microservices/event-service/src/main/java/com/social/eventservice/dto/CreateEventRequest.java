package com.social.eventservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateEventRequest {
    
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, max = 100, message = "Le titre doit contenir entre 3 et 100 caractères")
    private String title;
    
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    @NotBlank(message = "Le lieu est obligatoire")
    private String location;
    
    @NotNull(message = "La date de l'événement est obligatoire")
    @Future(message = "La date de l'événement doit être dans le futur")
    private LocalDateTime eventDate;
    
    @Min(value = 1, message = "La capacité minimale est de 1")
    @Max(value = 10000, message = "La capacité maximale est de 10000")
    private Integer capacity;
    
    @NotBlank(message = "La catégorie est obligatoire")
    private String category;
}