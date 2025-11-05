package com.main.editco.controller;

import com.main.editco.dto.CursorPositionMessage;
import com.main.editco.dto.DocumentEditMessage;
// import org.apache.logging.log4j.message.SimpleMessage;
import com.main.editco.dto.UserPresenceMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/document/{documentId}/edit")
    @SendTo("/topic/document/{documentId}/updates")
    public DocumentEditMessage handleDocumentEdit(@DestinationVariable Long documentId,
                                                  DocumentEditMessage message,
                                                  SimpleMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        message.setSessionId(sessionId);
        message.setTimestamp(System.currentTimeMillis());
        return message;
    }
    @MessageMapping("/document/{documentId}/cursor")
    @SendTo("/topic/document/{documentId}/cursors")
    public CursorPositionMessage handleCursorPosition(
            @DestinationVariable Long documentId,
            CursorPositionMessage message,
            SimpleMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        message.setSessionId(sessionId);
        message.setTimestamp(System.currentTimeMillis());

        return message;
    }

    @MessageMapping("/document/{documentId}/presence")
    @SendTo("/topic/document/{documentId}/presence")
    public UserPresenceMessage handleUserPresence(
            @DestinationVariable Long documentId,
            UserPresenceMessage message,
            SimpleMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        message.setSessionId(sessionId);
        message.setTimestamp(System.currentTimeMillis());

        return message;
    }
}
