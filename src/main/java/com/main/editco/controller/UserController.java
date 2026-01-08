package com.main.editco.controller;

import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;
    
    @Autowired
    UserRepository userRepository;
    
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id) {
        // TODO: user fetch and all
        return "User info";
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Return user without sensitive data
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getName(), user.getEmail()));
    }
    
    // Simple DTO to avoid exposing password
    public record UserDTO(Long id, String name, String email) {}
}
