package com.main.editco.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class EnvConfig {
    @PostConstruct
    public void loadEnv() {
        try {
            String projectRoot = System.getProperty("user.dir");
            File envFile = new File(projectRoot + ".env");
            System.out.println("Loading env file: ");
            System.out.println(projectRoot);
            System.out.println(".env file path: " + envFile.getAbsolutePath());
            System.out.println(".env file exists: " + envFile.exists());
            System.out.println(".env file canread: " + envFile.canRead());
            if (!envFile.exists()) {
                System.err.println("ERROR: .env file NOT FOUND at: " + envFile.getAbsolutePath());
                System.err.println("Please create .env file in project root with:");
                System.err.println("JWT_SECRET=your-secret-key");
                System.err.println("H2_CONSOLE_ENABLED=true");
                return;
            }
            Dotenv dotenv = Dotenv.configure()
                    .directory(projectRoot)
                    .load();

            dotenv.entries().forEach((entry) -> {
                System.setProperty(entry.getKey(), entry.getValue());
                System.out.println("Loaded: " + entry.getKey() + " = " +
                        (entry.getKey().contains("SECRET") ? "***HIDDEN***" : entry.getValue()));
            });

            System.out.println("✅ .env file loaded successfully");
            System.out.println("========================");

        } catch (Exception e) {
            System.err.println("❌ ERROR loading .env file:");
            e.printStackTrace();
            throw new RuntimeException("Failed to load .env file", e);
        }
    }
        }