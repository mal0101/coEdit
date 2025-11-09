package com.main.editco.controller;

import com.main.editco.dao.entities.User;
import com.main.editco.dto.LoginRequest;
import com.main.editco.dto.RegisterRequest;
import com.main.editco.service.AuthService;
import com.main.editco.service.RateLimitingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;
    @Autowired
    private RateLimitingService rateLimitingService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        User user = authService.register(registerRequest);

        if (user == null) {
            throw new IllegalArgumentException("Email already exists");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
        ));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (!rateLimitingService.allowRequest(loginRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of(
                            "error", "Too Many Requests",
                            "message","Too many login attempts. Please try again in 1 minute.",
                            "retryAfter", "60 seconds"
                    ));
        }

        String jwt = authService.login(loginRequest);

        if (jwt == null) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("type", "Bearer");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = authService.getCurrentUser(email);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return ResponseEntity.ok(user);
    }
}