package com.social.adminservice.client;

import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class InteractionClientFallback implements InteractionClient {
    @Override
    public Map<String, Object> getEventLikes(Long id) {
        return Collections.singletonMap("count", 0);
    }

    @Override
    public Map<String, Object> getParticipantsCount(Long id) {
        return Collections.singletonMap("count", 0);
    }

    @Override
    public List<Object> getEventComments(Long id) {
        return Collections.emptyList();
    }
}