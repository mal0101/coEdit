package com.main.editco.service;

import com.main.editco.dao.entities.VersionHistory;
import com.main.editco.dao.repositories.VersionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VersionHistoryService {
    @Autowired VersionHistoryRepository versionHistoryRepository;

    public List<VersionHistory> getVersionHistory(Long documentId) {
        return versionHistoryRepository.findByDocumentIdOrderByTimestampDesc(documentId);
    }
    public VersionHistory addVersionHistory(VersionHistory versionHistory) {
        return versionHistoryRepository.save(versionHistory);
    }
}
