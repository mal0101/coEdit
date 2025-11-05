package com.main.editco.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentEditMessage {
    private Long documentId;
    private String email;
    private String userName;
    private String operation; // this will genenrally be "insert", "delete" or "replace"
    private Integer cursorPosition;
    private String changeContent;
    private Integer length;
    private String sessionId;
    private Long timestamp;
}
