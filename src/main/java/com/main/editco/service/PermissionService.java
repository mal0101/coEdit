package com.main.editco.service;

import com.main.editco.dao.entities.Permission;
import com.main.editco.dao.repositories.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {
    @Autowired PermissionRepository permissionRepository;

    public Permission grantPermission(Permission permission) {
        List<Permission> existingPermissions = permissionRepository.findByDocumentId(permission.getDocument().getId());
        Optional<Permission> existingPermission = existingPermissions.stream().filter(p -> p.getUser().getId().equals(permission.getUser().getId())).findFirst();
        if (existingPermission.isPresent()) {
            Permission existing = existingPermission.get();
            existing.setAccessType(permission.getAccessType());
            return permissionRepository.save(existing);
        }

        return permissionRepository.save(permission);
    }

    public boolean revokePermission(Long permissionId) {
        if (permissionRepository.existsById(permissionId)) {
            permissionRepository.deleteById(permissionId);
            return true;
        }
        return false;
    }

    public int revokeAllPermissionsForUser(Long userId, Long documentId) {
        List<Permission> permissions = permissionRepository.findByDocumentId(documentId);
        List<Permission> userPermissions = permissions.stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .toList();

        userPermissions.forEach(p -> permissionRepository.deleteById(p.getId()));
        return userPermissions.size();
    }

    public List<Permission> getPermissionsByDocumentId(Long documentId) {
        return permissionRepository.findByDocumentId(documentId);
    }

    public List<Permission> getPermissionsByUserId(Long userId) {
        return permissionRepository.findByUserId(userId);
    }

    public Optional<Permission> getPermission(Long id) {
        return permissionRepository.findById(id);
    }
}
