package com.social.adminservice.client;

import org.springframework.stereotype.Component;

import com.social.adminservice.dto.CommentSummaryDTO;

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
    public List<CommentSummaryDTO> getEventComments(Long id) {
        return java.util.Collections.emptyList();
}
    @Override
    public void hideComment(Long commentId) {
        System.out.println("Panic: interaction-service est down, impossible de masquer.");
    }
}