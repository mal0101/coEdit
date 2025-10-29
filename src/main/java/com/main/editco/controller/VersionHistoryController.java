package com.main.editco.controller;

import com.main.editco.service.VersionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
public class VersionHistoryController {
    @Autowired
    VersionHistoryService versionHistoryService;

    @GetMapping("/doc/{docId}")
    public String getHistory(@PathVariable Long docId) {
        //TODO
        return "History list";
    }
    @PostMapping("/restore")
    public String restore(/*DTO*/) {
        //TODO
        return "Version restored";
    }
}
