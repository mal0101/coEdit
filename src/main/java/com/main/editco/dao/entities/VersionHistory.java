package com.main.editco.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VersionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonIgnoreProperties({"comments", "versions", "permissions", "content"})
    private Document document;
    @Column(columnDefinition = "TEXT")
    private String content;
    @ManyToOne
    @JoinColumn(name = "edited_by")
    @JsonIgnoreProperties({"passwordHashed", "ownedDocuments", "permissions", "comments"})
    private User editedBy;

    private Instant timestamp;
}
