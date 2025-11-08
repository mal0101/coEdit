package com.main.editco.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.security.SignatureException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex,
            WebRequest request) {
        return buildErrorResponse(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST,
                request.getDescription(false)
        );
    }
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameNotFound(
            UsernameNotFoundException ex,
            WebRequest request) {
        return buildErrorResponse(
          "User not found",
          HttpStatus.NOT_FOUND,
          request.getDescription(false)
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex,
            WebRequest request
    ) {
        return buildErrorResponse(
                "Invalid email or password",
                HttpStatus.UNAUTHORIZED,
                request.getDescription(false)
        );
    }
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, Object>> handleExpiredJwt(
            ExpiredJwtException ex,
            WebRequest request
    ) {
        return buildErrorResponse(
                "Your session has expired. Please login again",
                HttpStatus.UNAUTHORIZED,
                request.getDescription(false)
        );
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Map<String, Object>> handleMalformedJwt(
            MalformedJwtException ex,
            WebRequest request
    ) {
        return buildErrorResponse(
                "Invalid authentication token",
                HttpStatus.UNAUTHORIZED,
                request.getDescription(false)
        );
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<Map<String, Object>> handleSignatureException(
            SignatureException ex,
            WebRequest request
    ) {
        return buildErrorResponse(
                "Invalid authentication token signature",
                HttpStatus.UNAUTHORIZED,
                request.getDescription(false)
        );
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(
            NullPointerException ex,
            WebRequest request
    ) {
        System.err.println(ex.getMessage());
        ex.printStackTrace();
        return buildErrorResponse(
                "An unexpected error occurred. Please try again",
                HttpStatus.INTERNAL_SERVER_ERROR,
                request.getDescription(false)
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex,
            WebRequest request
    ) {
        System.err.println(ex.getMessage());
        ex.printStackTrace();
        return buildErrorResponse(
                "An error occured: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR,
                request.getDescription(false)
        );
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            String message,
            HttpStatus status,
            String path
            ) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("message", message);
        errorResponse.put("path", path.replace("uri=", ""));
        return ResponseEntity.status(status).body(errorResponse);
    }
}
