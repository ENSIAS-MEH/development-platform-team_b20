package com.social.eventservice.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
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
    
    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
    
    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    
    // Vérifier si l'événement est complet
    public boolean isFull() {
        return capacity != null && comments.size() >= capacity;
    }
    
    // Vérifier si l'événement est passé
    public boolean isPast() {
        return eventDate != null && eventDate.isBefore(LocalDateTime.now());
    }
}