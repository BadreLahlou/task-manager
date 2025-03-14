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
@Data // Lombok annotation to generate getters, setters, toString, etc.
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

    // 2FA Fields
    @Column
    private String totpSecret; // Stores the TOTP secret for 2FA

    @Column
    private boolean isTwoFactorEnabled; // Flag to enable/disable 2FA for the user
    
    @Transient // This field is not stored in the database
    private String password; // Raw password for authentication and registration
    
    public String getPassword() {
        return password;
    }
}
