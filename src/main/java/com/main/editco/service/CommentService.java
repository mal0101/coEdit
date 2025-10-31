package com.main.editco.service;

import com.main.editco.dao.entities.Comment;
import com.main.editco.dao.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired CommentRepository commentRepository;

    public List<Comment> getCommentsByDocumentId(Long documentId) {
        return commentRepository.findByDocumentId(documentId);
    }
    public Comment addComment(Comment comment) {
        comment.setCreatedAt(Instant.now());
        return commentRepository.save(comment);
    }
    public Optional<Comment> updateComment(Long commentId, Comment updatedComment) {
        return commentRepository.findById(commentId).map(existing -> {
            existing.setBody(updatedComment.getBody());
            existing.setCreatedAt(updatedComment.getCreatedAt());
            return commentRepository.save(existing);
        });
    }

    public boolean deleteComment(Long commentId) {
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
            return true;
        }
        return false;
    }
}
