package com.main.editco.controller;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.service.DocumentService;
import com.main.editco.service.PermissionCheckService;
import com.main.editco.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/docs")
public class DocumentController {
    @Autowired
    DocumentService documentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PermissionCheckService permissionCheckService;

    @GetMapping
    public List<Document>  getAllDocuments(Authentication authentication){
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        return documentService.getAllDocuments().stream()
                .filter(doc -> permissionCheckService.canView(currentUser.getId(), doc.getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);

        if (!permissionCheckService.canView(currentUser.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to view this doc");
        }
        Optional<Document> document = documentService.getDocumentById(id);
        return document.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Document> createDocument(@RequestBody Document document, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        document.setOwner(currentUser);
        Document createdDocument = documentService.createDocument(document);
        return ResponseEntity.ok(createdDocument);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Long id, @RequestBody Document document, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (!permissionCheckService.canView(currentUser.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have the permission to edit this document.");
        }
        Optional<Document> updatedDocument = documentService.updateDocument(id, document);
        return updatedDocument.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);

        if (!permissionCheckService.canDelete(currentUser.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have the permission to delete this document.");
        }
        boolean deleted = documentService.deleteDocument(id);
        if (deleted)
            return ResponseEntity.ok().body("Document has been deleted.");
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Document> getDocumentsByOwnerId(@PathVariable Long ownerId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);

        if (!currentUser.getId().equals(ownerId))
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can's view this document");
        }
        List<Document> documents = documentService.getDocumentsByOwnerId(ownerId);
        return ResponseEntity.ok(documents);
    }

}
