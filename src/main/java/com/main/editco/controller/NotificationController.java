package com.main.editco.controller;

import com.main.editco.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired NotificationService notificationService;
    @PostMapping("/send")
    public String sendNotification(/*DTO*/) {
        //TODO
        return "Notification sent";
    }
}
