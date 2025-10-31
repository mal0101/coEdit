package com.main.editco.service;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    @Autowired DocumentRepository documentRepository;

    public List<Document> getAllDocuments(){
        return documentRepository.findAll();
    }
    public List<Document> getDocumentsByOwnerId(Long ownerId){
        return documentRepository.findByOwnerId(ownerId);
    }

    public Document createDocument(Document document) {
        document.setCreatedAt(java.time.Instant.now());
        document.setUpdatedAt(java.time.Instant.now());
        return documentRepository.save(document);
    }

    public Optional<Document> updateDocument(Long id, Document updatedDoc) {
        return documentRepository.findById(id).map(existing -> {
            existing.setTitle(updatedDoc.getTitle());
            existing.setContent(updatedDoc.getContent());
            existing.setUpdatedAt(java.time.Instant.now());
            return documentRepository.save(existing);
        });
    }

    public boolean deleteDocument(Long id) {
        if (documentRepository.existsById(id)){
            documentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
