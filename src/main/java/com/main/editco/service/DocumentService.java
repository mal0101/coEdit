package com.main.editco.service;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {
    @Autowired DocumentRepository documentRepository;

    public List<Document> getDocumentsByOwnerId(Long ownerId){
        return documentRepository.findByOwnerId(ownerId);
    }

    public Document createDocument(Document doc) {
        return documentRepository.save(doc);
    }
    // TODO: add update, delete, getById etc etc
}
