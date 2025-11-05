package com.main.editco.controller;

import com.main.editco.dao.entities.Document;
import com.main.editco.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/docs")
public class DocumentController {
    @Autowired
    DocumentService documentService;
    @GetMapping
    public List<Document>  getAllDocuments(){
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id) {
        Optional<Document> document = documentService.getDocumentById(id);
        return document.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Document> createDocument(@RequestBody Document document) {
        Document createdDocument = documentService.createDocument(document);
        return ResponseEntity.ok(createdDocument);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Long id, @RequestBody Document document) {
        Optional<Document> updatedDocument = documentService.updateDocument(id, document);
        return updatedDocument.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        boolean deleted = documentService.deleteDocument(id);
        if (deleted)
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Document> getDocumentsByOwnerId(@PathVariable Long ownerId) {
        return documentService.getDocumentsByOwnerId(ownerId);
    }

}
