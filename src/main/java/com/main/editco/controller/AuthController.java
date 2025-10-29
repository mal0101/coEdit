package com.main.editco.controller;

import com.main.editco.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthService authService;
    @PostMapping("/signup")
    public String register(/*DTO*/) {
        // TODO use authservice to register
        return "User registered successfully";
    }
    @PostMapping("/login")
    public String login(/*DTO*/) {
        // TODO use authservice to login
        return "JWT token";
    }
    @GetMapping("/me")
    public String currentUser(/*DTO*/) {
        // TODO
        return "Current user info";
    }
}
