package com.main.editco.dao.repositories;

import com.main.editco.dao.entities.VersionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VersionHistoryRepository extends JpaRepository<VersionHistory,Long> {
    List<VersionHistory> findByDocumentIdOrderByTimestampDesc(Long documentId);
}
