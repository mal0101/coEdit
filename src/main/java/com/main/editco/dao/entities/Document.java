package com.main.editco.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @ManyToOne
    @JoinColumn(name="owner_id")
    private User owner;
    private Instant createdAt;
    private Instant updatedAt;
    @JsonIgnore
    @OneToMany(mappedBy = "document")
    private Set<Permission> permissions;
    @JsonIgnore
    @OneToMany(mappedBy = "document")
    private Set<Comment> comments;
    @JsonIgnore
    @OneToMany(mappedBy = "document")
    private Set<VersionHistory>  versions;
}
