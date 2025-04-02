package com.badrelahlou.taskmanager.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Table(name = "users")
@Data 
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @JsonIgnore
    private String passwordHash;
    
    @Column(nullable = false, unique = true)
    private String email;

    

    @ElementCollection
    private List<String> permissions;

    
    @Column
    private String totpSecret; 

    @Column
    private boolean isTwoFactorEnabled; 
    
    @Transient 
    private String password; 
    
    public String getPassword() {
        return password;
    }
}
