package com.main.editco.dao.repositories;

import com.main.editco.dao.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission,Long> {
    List<Permission> findByDocumentId(Long documentId);
    List<Permission> findByUserId(Long userId);
}
