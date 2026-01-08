package com.main.editco.service;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.repositories.CommentRepository;
import com.main.editco.dao.repositories.DocumentRepository;
import com.main.editco.dao.repositories.PermissionRepository;
import com.main.editco.dao.repositories.VersionHistoryRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class DocumentService {
    @Autowired DocumentRepository documentRepository;
    @Autowired CommentRepository commentRepository;
    @Autowired PermissionRepository permissionRepository;
    @Autowired VersionHistoryRepository versionHistoryRepository;

    @Transactional(readOnly=true)
    public List<Document> getAllDocuments(){
        log.debug("Fetching all documents");
        return documentRepository.findAll();
    }
    @Transactional(readOnly=true)
    public Optional<Document> getDocumentById(Long id) {
        log.debug("Fetching document by id {}", id);
        return documentRepository.findById(id);
    }
    @Transactional(readOnly=true)
    public List<Document> getDocumentsByOwnerId(Long ownerId){
        log.debug("Fetching documents by owner id {}", ownerId);
        return documentRepository.findByOwnerId(ownerId);
    }
    @Transactional
    public Document createDocument(Document document) {
        document.setCreatedAt(java.time.Instant.now());
        document.setUpdatedAt(java.time.Instant.now());
        return documentRepository.save(document);
    }
    @Transactional
    public Optional<Document> updateDocument(Long id, Document updatedDoc) {
        return documentRepository.findById(id).map(existing -> {
            existing.setTitle(updatedDoc.getTitle());
            existing.setContent(updatedDoc.getContent());
            existing.setUpdatedAt(java.time.Instant.now());
            return documentRepository.save(existing);
        });
    }
    @Transactional
    public boolean deleteDocument(Long id) {
        if (documentRepository.existsById(id)){
            // Delete all related entities first to avoid foreign key constraint violations
            log.debug("Deleting comments for document {}", id);
            commentRepository.findByDocumentId(id).forEach(comment -> 
                commentRepository.deleteById(comment.getId()));
            
            log.debug("Deleting permissions for document {}", id);
            permissionRepository.findByDocumentId(id).forEach(permission -> 
                permissionRepository.deleteById(permission.getId()));
            
            log.debug("Deleting version history for document {}", id);
            versionHistoryRepository.findByDocumentIdOrderByTimestampDesc(id).forEach(version -> 
                versionHistoryRepository.deleteById(version.getId()));
            
            log.debug("Deleting document {}", id);
            documentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
