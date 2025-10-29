package com.main.editco.dao.repositories;

import com.main.editco.dao.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    List<Document> findByOwnerId(Long ownerId);
}
