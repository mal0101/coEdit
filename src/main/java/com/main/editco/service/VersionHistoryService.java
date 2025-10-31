package com.main.editco.service;

import com.main.editco.dao.entities.VersionHistory;
import com.main.editco.dao.repositories.VersionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class VersionHistoryService {
    @Autowired VersionHistoryRepository versionHistoryRepository;

    public List<VersionHistory> getVersionHistory(Long documentId) {
        return versionHistoryRepository.findByDocumentIdOrderByTimestampDesc(documentId);
    }
    public VersionHistory addVersionHistory(VersionHistory versionHistory) {
        versionHistory.setTimestamp(Instant.now());
        return versionHistoryRepository.save(versionHistory);
    }
    public Optional<VersionHistory> getVersion(Long versionId) {
        return versionHistoryRepository.findById(versionId);
    }
}
