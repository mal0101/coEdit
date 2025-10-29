package com.main.editco.service;

import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired UserRepository userRepository;
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    // TODO: add profile update, password reset etc
}
