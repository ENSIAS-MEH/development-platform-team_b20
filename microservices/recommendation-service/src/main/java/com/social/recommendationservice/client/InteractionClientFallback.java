package com.social.recommendationservice.client;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class InteractionClientFallback implements InteractionClient {
    @Override
    public List<Long> getParticipantIds(Long eventId) { return new ArrayList<>(); }
    
    @Override
    public Map<String, Object> getParticipantsCount(Long eventId) { 
        return Collections.singletonMap("count", 0); 
    }
    
    @Override
    public Map<String, Object> getLikesCount(Long eventId) { 
        return Collections.singletonMap("count", 0); 
    }
    
    @Override
    public List<Object> getComments(Long eventId) { return new ArrayList<>(); }
}