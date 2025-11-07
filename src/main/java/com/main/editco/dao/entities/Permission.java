package com.main.editco.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonIgnoreProperties({"comments", "versions", "permissions", "owner"})
    private Document document;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"passwordHashed", "ownedDocuments", "permissions", "comments"})
    private User user;

    @Enumerated(EnumType.STRING)
    private AccessType accessType;
}
