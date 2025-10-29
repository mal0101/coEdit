package com.main.editco.controller;

import com.main.editco.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/docs")
public class DocumentController {
    @Autowired
    DocumentService documentService;
    @GetMapping
    public String listDocuments(/*User id param*/) {
        // TODO
        return "List of docs";
    }
    @PostMapping
    public String createDocument(/*DTO*/) {
        // TODO
        return "doc created";
    }
    @GetMapping
    public String getDocument(@PathVariable Long id) {
        // TODO
        return "Doc details";
    }
}
