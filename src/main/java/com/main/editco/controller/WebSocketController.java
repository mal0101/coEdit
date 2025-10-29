package com.main.editco.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping
    @SendTo("/topic/updates")
    public String handleEdit(/*WebSocket payload*/) {
        //TODO
        return "Real-time update";
    }
}
