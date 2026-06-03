package com.social.adminservice.dto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
public class EventDetailsDTO {
    private Long id;
    private String title;
    private String location;
    private String eventDate;
    private long likesCount;
    private long participantsCount;
    private long commentsCount;
    private List<Long> participantIds; // On utilisera les IDs en attendant les emails d'Issam
}