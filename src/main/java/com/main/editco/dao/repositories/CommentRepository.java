package com.main.editco.dao.repositories;

import com.main.editco.dao.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findByDocumentId(Long documentId);
}
