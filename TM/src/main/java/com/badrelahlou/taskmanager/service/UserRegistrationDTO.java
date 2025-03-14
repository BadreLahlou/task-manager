package com.badrelahlou.taskmanager.service;

import com.badrelahlou.taskmanager.model.Role;

public class UserRegistrationDTO {
    private String username;
    private String email;
    private String password;
    private Role role;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}