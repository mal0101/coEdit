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
        return permissionRepository.save(permission);
    }

    public boolean revokePermission(Long permissionId) {
        if (permissionRepository.existsById(permissionId)) {
            permissionRepository.deleteById(permissionId);
            return true;
        }
        return false;
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
