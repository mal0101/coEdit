package com.main.editco.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursorPositionMessage {
    private Long documentId;
    private String userId;
    private String userName;
    private String userColor;
    private Integer cursorPosition;
    private Integer selectionStart;
    private Integer selectionEnd;
    private String sessionId;
    private Long timestamp;
}
