package com.main.editco.service;

import com.main.editco.dao.entities.AccessType;
import com.main.editco.dao.entities.Document;
import com.main.editco.dao.entities.Permission;
import com.main.editco.dao.repositories.DocumentRepository;
import com.main.editco.dao.repositories.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionCheckService {
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private PermissionRepository permissionRepository;

    public boolean canView(Long userId, Long documentId) {
        Optional<Document> docOpt = documentRepository.findById(documentId);
        if (!docOpt.isPresent()) {
            return false;
        }
        Document document = docOpt.get();
        if (document.getOwner().getId().equals(userId)) {
            return true;
        }
        List<Permission> permissions = permissionRepository.findByDocumentId(documentId);
        return permissions.stream()
                .anyMatch(permission -> permission.getUser().getId().equals(userId));
    }

    public boolean canEdit(Long userId, Long documentId) {
        Optional<Document> docOpt = documentRepository.findById(documentId);
        if (!docOpt.isPresent()) {
            return false;
        }
        Document document = docOpt.get();
        if (document.getOwner().getId().equals(userId)) {
            return true;
        }
        List<Permission> permissions = permissionRepository.findByDocumentId(documentId);
        return permissions.stream()
                .anyMatch(permission -> permission.getUser().getId().equals(userId) && (permission.getAccessType() == AccessType.EDITOR || permission.getAccessType() == AccessType.OWNER));
    }
    public boolean isOwner(Long userId, Long documentId) {
        Optional<Document> docOpt = documentRepository.findById(documentId);
        if (!docOpt.isPresent()) {
            return false;
        }
        Document document = docOpt.get();
        return document.getOwner().getId().equals(userId);
    }

    public boolean canDelete(Long userId, Long documentId) {
        return isOwner(userId, documentId);
    }
    public boolean canManagePermissions(Long userId, Long documentId) {
        return isOwner(userId, documentId);
    }
}
