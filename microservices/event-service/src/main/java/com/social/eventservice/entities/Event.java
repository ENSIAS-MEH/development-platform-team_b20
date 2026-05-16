package com.social.eventservice.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "events", schema = "events_schema") 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private String location;
    
    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;
    
    private Integer capacity;
    
    private String category;
    
    // MICROSERVICES : On stocke juste l'ID de l'organisateur (User)
    // On ne met pas @ManyToOne car la classe User n'est pas dans ce projet
    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;

    // Note : La liste des commentaires a été supprimée car elle sera gérée 
    // par le microservice "interaction-service".

    // Vérifier si l'événement est passé
    public boolean isPast() {
        return eventDate != null && eventDate.isBefore(LocalDateTime.now());
    }
}