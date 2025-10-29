package com.main.editco.service;

import com.main.editco.dao.entities.Permission;
import com.main.editco.dao.repositories.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {
    @Autowired PermissionRepository permissionRepository;

    public List<Permission> getPermissionsByDocumentId(Long documentId) {
        return permissionRepository.findByDocumentId(documentId);
    }
    // TODO: add methods for granting/revoking permission
}
