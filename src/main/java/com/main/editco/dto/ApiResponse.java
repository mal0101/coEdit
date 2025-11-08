package com.main.editco.dto;

import java.time.Instant;

public class ApiResponse {
    private String message;
    private Instant timestamp;
    private boolean success;

    public ApiResponse(String message) {
        this.message = message;
        this.timestamp = Instant.now();
        this.success = true;
    }

    public ApiResponse(String message, boolean success) {
        this.message = message;
        this.timestamp = Instant.now();
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    public Instant getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
}
