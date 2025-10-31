package com.main.editco.controller;

import com.main.editco.dao.entities.Permission;
import com.main.editco.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {
    @Autowired
    PermissionService permissionService;
    @PostMapping("/grant")
    public ResponseEntity<Permission> grant(@RequestBody Permission permission) {
        Permission grantedPermission = permissionService.grantPermission(permission);
        return ResponseEntity.ok(grantedPermission);
    }

    @DeleteMapping("/{permissionId}")
    public ResponseEntity<?> revoke(@PathVariable Long permissionId) {
        boolean revokedPermission = permissionService.revokePermission(permissionId);
        if (revokedPermission) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public List<Permission> getPermissionsByUser(@PathVariable Long userId) {
        return permissionService.getPermissionsByUserId(userId);
    }

    @GetMapping("/doc/{documentId}")
    public List<Permission> getPermissionsByDocument(@PathVariable Long documentId) {
        return permissionService.getPermissionsByDocumentId(documentId);
    }
}

