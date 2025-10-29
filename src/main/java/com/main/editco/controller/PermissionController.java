package com.main.editco.controller;

import com.main.editco.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {
    @Autowired
    PermissionService permissionService;
    @PostMapping("/grant")
    public String grant(/*DTO*/) {
        // TODO
        return "Permission granted";
    }
    @PostMapping("/revoke")
    public String revoke(/*DTO*/) {
        // TODO
        return "Permission revoked";
    }
}
