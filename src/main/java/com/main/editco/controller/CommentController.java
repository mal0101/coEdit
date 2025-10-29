package com.main.editco.controller;

import com.main.editco.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    CommentService commentService;
    @PostMapping
    public String addComment(/*DTO*/) {
        // TODO
        return "Comment added";
    }
    @GetMapping("/doc/{docId}")
    public String getComments(@PathVariable Long docId) {
        //TODO
        return "Comment list";
    }
}
