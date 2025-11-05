package com.main.editco.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPresenceMessage {
    private Long documentId;
    private String userId;
    private String userName;
    private String action; // varies between "join", "leave"
    private String sessionId;
    private Long timestamp;
}
