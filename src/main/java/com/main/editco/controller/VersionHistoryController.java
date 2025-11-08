package com.main.editco.controller;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.entities.User;
import com.main.editco.dao.entities.VersionHistory;
import com.main.editco.dao.repositories.DocumentRepository;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.service.PermissionCheckService;
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

    @Autowired
    private PermissionCheckService  permissionCheckService;

    @PostMapping
    public ResponseEntity<?> addVersionHistory(@RequestBody VersionHistory versionHistory, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        Long documentId = versionHistory.getDocument().getId();

        if (!permissionCheckService.canEdit(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to create version history");
        }
        VersionHistory createdVersionHistory = versionHistoryService.addVersionHistory(versionHistory);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVersionHistory);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> getVersionHistory(@PathVariable Long documentId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (!permissionCheckService.canView(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to view this version history");
        }
        List<VersionHistory> versionHistory = versionHistoryService.getVersionHistory(documentId);
        return ResponseEntity.status(HttpStatus.OK).body(versionHistory);
    }

    @GetMapping("/{versionId}")
    public ResponseEntity<?> getVersion(@PathVariable Long versionId,  Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        Optional<VersionHistory> versionOpt = versionHistoryService.getVersion(versionId);
        if (!versionOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        VersionHistory versionHistory = versionOpt.get();
        Long documentId = versionHistory.getDocument().getId();
        if (!permissionCheckService.canView(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to view this version history");
        }
        return ResponseEntity.status(HttpStatus.OK).body(versionHistory);
    }

    @PostMapping("/{versionId}/restore")
    public ResponseEntity<?> restoreVersion(@PathVariable Long versionId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        Optional<VersionHistory> versionOpt = versionHistoryService.getVersion(versionId);
        if (!versionOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        VersionHistory versionToRestore = versionOpt.get();
        Long documentId = versionToRestore.getDocument().getId();

        if (!permissionCheckService.canEdit(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to restore this version history");
        }
        Optional<Document> documentOpt = documentRepository.findById(documentId);
        if (!documentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Document document = documentOpt.get();
        VersionHistory currentStateBackup = new VersionHistory();
        currentStateBackup.setDocument(document);
        currentStateBackup.setContent(document.getContent());
        currentStateBackup.setEditedBy(currentUser);
        currentStateBackup.setTimestamp(versionToRestore.getTimestamp());
        versionHistoryService.addVersionHistory(currentStateBackup);
        document.setContent(versionToRestore.getContent());
        document.setUpdatedAt(versionToRestore.getTimestamp());
        documentRepository.save(document);
        return ResponseEntity.status(HttpStatus.OK).body(document);
    }
}
