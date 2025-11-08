package com.main.editco.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    @PostConstruct
    public void loadEnv() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach((entry) -> {System.setProperty(entry.getKey(), entry.getValue());});
            System.out.println(".env file loaded correctly");

        } catch (Exception e) {
            System.out.println("Error loading env file");
        }
    }
}
