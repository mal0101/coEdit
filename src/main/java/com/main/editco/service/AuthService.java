package com.main.editco.service;

import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.dto.LoginRequest;
import com.main.editco.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtService jwtService;

    public User register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.email) != null) return null;

        User user = new User();
        user.setEmail(registerRequest.email);
        user.setName(registerRequest.name);
        user.setPasswordHashed(passwordEncoder.encode(registerRequest.password));
        user.setRole("USER");
        return userRepository.save(user);
    }
    public String login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.email);
        if (user == null) return null;
        if (!passwordEncoder.matches(loginRequest.password, user.getPasswordHashed())) return null;
        return jwtService.generateToken(user);
    }
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email);
    }
}
