package com.main.editco.service;

import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;

    public User register(String email, String name, String password) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPasswordHashed(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            if (passwordEncoder.matches(password, user.getPasswordHashed())) {
                return user;
            }
        }
        return null;
    }
}
