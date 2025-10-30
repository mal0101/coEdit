package com.main.editco.dao.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable=false)
    private String email;
    @Column(nullable=false)
    private String passwordHashed;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false)
    private String role;
    @OneToMany(mappedBy = "owner")
    private Set<Document> ownedDocuments;
    @OneToMany(mappedBy="user")
    private Set<Permission> permissions;
    @OneToMany(mappedBy = "user")
    private Set<Comment> comments;

}
