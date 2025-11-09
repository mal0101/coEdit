package com.main.editco.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public UrlBasedCorsConfigurationSource corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",    // React default (Create React App)
                "http://localhost:3001",    // Alternative React port
                "http://localhost:4200",    // Angular default
                "http://localhost:5173",    // Vite default (modern React/Vue)
                "http://localhost:8080",    // Another common port
                "http://localhost:8081",    // Yet another common port
                "http://127.0.0.1:3000",    // Same as localhost but IP
                "http://127.0.0.1:5173"     // Vite with IP
                // add actual domain later
        ));
        config.addAllowedHeader("*");
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Total-Count",
                "X-Request-Id"
        ));
        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
