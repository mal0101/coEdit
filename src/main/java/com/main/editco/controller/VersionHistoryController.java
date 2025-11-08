package com.main.editco.controller;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.entities.User;
import com.main.editco.dao.entities.VersionHistory;
import com.main.editco.dao.repositories.DocumentRepository;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.service.VersionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/history")
public class VersionHistoryController {
    @Autowired
    VersionHistoryService versionHistoryService;
    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<VersionHistory> addVersionHistory(@RequestBody VersionHistory versionHistory) {
        VersionHistory createdVersionHistory = versionHistoryService.addVersionHistory(versionHistory);
        return ResponseEntity.ok(createdVersionHistory);
    }

    @GetMapping("/document/{documentId}")
    public List<VersionHistory> getVersionHistory(@PathVariable Long documentId) {
        return versionHistoryService.getVersionHistory(documentId);
    }

    @GetMapping("/{versionId}")
    public ResponseEntity<VersionHistory> getVersion(@PathVariable Long versionId) {
        Optional<VersionHistory> version = versionHistoryService.getVersion(versionId);
        return version.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{versionId}/restore")
    public ResponseEntity<?> restoreVersion(@PathVariable Long versionId, Authentication authentication) {
        Optional<VersionHistory> versionOpt = versionHistoryService.getVersion(versionId);
        if (!versionOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        VersionHistory versionToRestore = versionOpt.get();
        Optional<Document> docOpt = documentRepository.findById(versionToRestore.getId());
        if (!docOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Document document =  docOpt.get();
        // getting curr user whos doing the restore
        String userEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(userEmail);
        if  (currentUser == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not found");
        }
        VersionHistory currentStateBackup = new VersionHistory();
        currentStateBackup.setDocument(document);
        currentStateBackup.setContent(document.getContent());
        currentStateBackup.setEditedBy(currentUser);
        currentStateBackup.setTimestamp(versionToRestore.getTimestamp());

        // save backup
        versionHistoryService.addVersionHistory(currentStateBackup);
        document.setContent(versionToRestore.getContent());
        document.setUpdatedAt(versionToRestore.getTimestamp());
        documentRepository.save(document);
        return ResponseEntity.ok().build();
    }
}
