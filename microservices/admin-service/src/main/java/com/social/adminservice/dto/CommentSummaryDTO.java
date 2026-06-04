package com.social.adminservice.dto;

import lombok.Data;

@Data
public class CommentSummaryDTO {
    private Long id;
    private String content;
    private Long userId;
    private Long eventId;
    private String status; // VISIBLE ou HIDDEN
}