package com.main.editco.controller;

import com.main.editco.dao.entities.User;
import com.main.editco.dto.LoginRequest;
import com.main.editco.dto.RegisterRequest;
import com.main.editco.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthService authService;
    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        User user = authService.register(registerRequest);
        if (user == null) return  ResponseEntity.badRequest().body("email already exists");
        return ResponseEntity.ok("User registered successfully");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String jwt = authService.login(loginRequest);
        if (jwt == null) return  ResponseEntity.badRequest().body("Invalid Credentials");
        return ResponseEntity.ok(jwt);
    }
    @GetMapping("/me")
    public ResponseEntity<?> currentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = authService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }
}
