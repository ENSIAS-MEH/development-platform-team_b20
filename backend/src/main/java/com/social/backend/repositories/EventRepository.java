package com.social.backend.repositories;

import com.social.backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCategory(String category);

    List<Event> findByLocationContaining(String location);

    List<Event> findByTitleContaining(String title);
}