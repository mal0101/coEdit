package com.main.editco.service;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.repositories.DocumentRepository;
import org.springframework.transaction.annotation.Transactional; // ✅ CORRECT
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class DocumentService {
    @Autowired DocumentRepository documentRepository;

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
            documentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
