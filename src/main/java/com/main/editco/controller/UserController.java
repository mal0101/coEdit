package com.main.editco.controller;

import com.main.editco.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id) {
        // TODO: user fetch and all
        return "User info";
    }
}
