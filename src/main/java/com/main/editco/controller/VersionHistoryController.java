package com.main.editco.controller;

import com.main.editco.dao.entities.Document;
import com.main.editco.dao.entities.VersionHistory;
import com.main.editco.dao.repositories.DocumentRepository;
import com.main.editco.service.VersionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public boolean restoreVersion(@PathVariable Long versionId) {
        Optional<VersionHistory> versionOpt = versionHistoryService.getVersion(versionId);
        if (versionOpt.isPresent()) {
            VersionHistory versionHistory = versionOpt.get();
            Optional<Document> docOpt = documentRepository.findById(versionHistory.getDocument().getId());
            if (docOpt.isPresent()) {
                Document document = docOpt.get();
                document.setContent(versionHistory.getContent());
                document.setUpdatedAt(java.time.Instant.now());
                documentRepository.save(document);
                return true;
            }
        }
        return false;
    }
}
