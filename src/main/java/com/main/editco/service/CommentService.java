package com.main.editco.service;

import com.main.editco.dao.entities.Comment;
import com.main.editco.dao.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    @Autowired CommentRepository commentRepository;

    public List<Comment> getCommentsByDocumentId(Long documentId) {
        return commentRepository.findByDocumentId(documentId);
    }
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }
    // TODO OPTIONALLY: add deleteComment, updateComment
}
