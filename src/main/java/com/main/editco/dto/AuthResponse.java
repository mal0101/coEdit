package com.main.editco.dto;

import java.time.Instant;

public class AuthResponse {
    private String message;
    private String token;
    private String tokenType;
    private Long userId;
    private String email;
    private String name;
    private Instant timestamp;

    public AuthResponse() {
        this.timestamp = Instant.now();
        this.tokenType = "Bearer";
    }

    public AuthResponse(String message, String token, Long userId, String email, String name) {
        this.message = message;
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.timestamp = Instant.now();
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getTokenType() {
        return tokenType;
    }
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Instant getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

