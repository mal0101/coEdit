package com.main.editco.service;

import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.dto.LoginRequest;
import com.main.editco.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthService {
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtService jwtService;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public User register(RegisterRequest registerRequest) {
        if (registerRequest.email ==  null || registerRequest.email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        String trimmedEmail = registerRequest.email.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userRepository.findByEmail(trimmedEmail) != null) {
            return null; //email already exists
        }
        if (registerRequest.password == null || registerRequest.password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (registerRequest.name == null || registerRequest.name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        User user = new User();
        user.setEmail(trimmedEmail);
        user.setName(registerRequest.name.trim());
        user.setPasswordHashed(passwordEncoder.encode(registerRequest.password));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public String login(LoginRequest loginRequest) {
        String trimmedEmail = loginRequest.email.trim().toLowerCase();
        User user = userRepository.findByEmail(trimmedEmail);
        if (user == null) return null;
        if (!passwordEncoder.matches(loginRequest.password, user.getPasswordHashed())) {
            return null;
        }
        return jwtService.generateToken(user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email);
    }
}
