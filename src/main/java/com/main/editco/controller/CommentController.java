package com.main.editco.controller;

import com.main.editco.dao.entities.Comment;
import com.main.editco.dao.entities.User;
import com.main.editco.dao.repositories.UserRepository;
import com.main.editco.service.CommentService;
import com.main.editco.service.PermissionCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    CommentService commentService;

    @Autowired
    PermissionCheckService permissionCheckService;

    @Autowired
    UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment,
                                        Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);

        Long documentId = comment.getDocument().getId();
        if (!permissionCheckService.canView(currentUser.getId(), documentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to comment on this document");
        }

        comment.setUser(currentUser);
        Comment createdComment = commentService.addComment(comment);
        return ResponseEntity.ok(createdComment);
    }

    @GetMapping("/doc/{docId}")
    public ResponseEntity<?> getCommentsByDocument(@PathVariable Long docId,
                                                   Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        if (!permissionCheckService.canView(currentUser.getId(), docId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You don't have permission to view comments on this document");
        }

        List<Comment> comments = commentService.getCommentsByDocumentId(docId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId,
                                           @RequestBody Comment updatedComment,
                                           Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);
        Optional<Comment> existingCommentOpt = commentService.getCommentsByDocumentId(
                updatedComment.getDocument().getId()
        ).stream().filter(c -> c.getId().equals(commentId)).findFirst();

        if (!existingCommentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Comment existingComment = existingCommentOpt.get();

        if (!existingComment.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only edit your own comments");
        }

        return commentService.updateComment(commentId, updatedComment)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId,
                                           Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email);

        Optional<Comment> commentOpt = commentService.getCommentsByDocumentId(0L)
                .stream().filter(c -> c.getId().equals(commentId)).findFirst();

        if (!commentOpt.isPresent()) {
            boolean deleted = commentService.deleteComment(commentId);
            if (deleted) {
                return ResponseEntity.ok().body("Comment deleted");
            }
            return ResponseEntity.notFound().build();
        }

        Comment comment = commentOpt.get();
        Long documentId = comment.getDocument().getId();

        boolean isAuthor = comment.getUser().getId().equals(currentUser.getId());
        boolean isDocOwner = permissionCheckService.isOwner(currentUser.getId(), documentId);

        if (!isAuthor && !isDocOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own comments or comments on your documents");
        }

        boolean deleted = commentService.deleteComment(commentId);
        if (deleted)
            return ResponseEntity.ok().body("Comment deleted");
        return ResponseEntity.notFound().build();
    }
}