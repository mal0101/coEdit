package com.main.editco.service;

import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.dto.LoginRequest;
import com.main.editco.dto.RegisterRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Slf4j
@Service
public class AuthService {
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtService jwtService;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public User register(RegisterRequest registerRequest) {
        log.info("Register request attempt: {}", registerRequest);
        if (registerRequest.email ==  null || registerRequest.email.trim().isEmpty()) {
            log.warn("Register request email is empty");
            throw new IllegalArgumentException("Email is required");
        }
        String trimmedEmail = registerRequest.email.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            log.warn("Register request email is invalid");
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userRepository.findByEmail(trimmedEmail) != null) {
            log.warn("Register request email already exists");
            return null; //email already exists
        }
        if (registerRequest.password == null || registerRequest.password.length()<8) {
            log.warn("Register request password too short for {}", trimmedEmail);
            throw new IllegalArgumentException("Password is required");
        }
        if (registerRequest.name == null || registerRequest.name.trim().isEmpty()) {
            log.warn("Register request name is empty");
            throw new IllegalArgumentException("Name is required");
        }
        User user = new User();
        user.setEmail(trimmedEmail);
        user.setName(registerRequest.name.trim());
        user.setPasswordHashed(passwordEncoder.encode(registerRequest.password));
        user.setRole("USER");
        User savedUser = userRepository.save(user);
        log.info("User saved: {}", savedUser);
        return savedUser;
    }

    public String login(LoginRequest loginRequest) {
        String trimmedEmail = loginRequest.email.trim().toLowerCase();
        log.info("Login request attempt for: {}", trimmedEmail);
        User user = userRepository.findByEmail(trimmedEmail);
        if (user == null) {
            log.warn("Login request failed: User not found - {}", trimmedEmail);
            return null;
        }
        if (!passwordEncoder.matches(loginRequest.password, user.getPasswordHashed())) {
            log.warn("Login request failed: Invalid password for {}", trimmedEmail);
            return null;
        }
        String token= jwtService.generateToken(user);
        log.info("Login request success for: {}", trimmedEmail);
        return token;
    }

    public User getCurrentUser(String email) {
        log.debug("Fetching current user for {}", email);
        return userRepository.findByEmail(email);
    }
}
