package com.main.editco.controller;

import com.main.editco.dao.entities.Permission;
import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.service.PermissionCheckService;
import com.main.editco.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {
    @Autowired
    PermissionService permissionService;
    @Autowired
    PermissionCheckService permissionCheckService;
    @Autowired
    UserRepository userRepository;


    @PostMapping("/grant")
    public ResponseEntity<?> grant(@RequestBody Permission permission, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        Long documentId = permission.getDocument().getId();
        if (!permissionCheckService.canManagePermissions(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the document owner can grant permissions");
        }
        Permission grantedPermission = permissionService.grantPermission(permission);
        return ResponseEntity.ok(grantedPermission);
    }

    @DeleteMapping("/{permissionId}")
    public ResponseEntity<?> revoke(@PathVariable Long permissionId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        var permissionOpt = permissionService.getPermission(permissionId);
        if (!permissionOpt.isPresent())
            return ResponseEntity.notFound().build();
        Permission permission = permissionOpt.get();
        Long documentId = permission.getDocument().getId();
        if (!permissionCheckService.canManagePermissions(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the document owner can revoke permissions");
        }
        boolean revokedPermission = permissionService.revokePermission(permissionId);
        if (revokedPermission) {
            return ResponseEntity.ok().body("Permission has been revoked");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPermissionsByUser(@PathVariable Long userId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (!currentUser.getId().equals(userId))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only view your own permissions");
        List<Permission> permissions = permissionService.getPermissionsByUserId(userId);
        return ResponseEntity.ok(permissions);

    }

    @GetMapping("/doc/{documentId}")
    public ResponseEntity<?> getPermissionsByDocument(@PathVariable Long documentId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (!permissionCheckService.isOwner(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only document owner can view all permissions");
        }
        List<Permission> permissions = permissionService.getPermissionsByDocumentId(documentId);
        return ResponseEntity.ok(permissions);
    }
}

