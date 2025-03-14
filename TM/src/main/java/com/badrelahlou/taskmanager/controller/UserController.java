package com.badrelahlou.taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.badrelahlou.taskmanager.model.Notification;
import com.badrelahlou.taskmanager.model.User;
import com.badrelahlou.taskmanager.service.JwtUtils;
import com.badrelahlou.taskmanager.service.NotificationService;
import com.badrelahlou.taskmanager.service.UserRegistrationDTO;
import com.badrelahlou.taskmanager.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;
   
    @Autowired
    private JwtUtils jwtUtils; // ✅ Inject JwtUtils instance
    
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody UserRegistrationDTO userDTO) {
        try {
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setPasswordHash(userDTO.getPassword());
            user.setRole(userDTO.getRole());
            user = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<User> updatePermissions(@PathVariable Long id, @RequestBody List<String> permissions) {
        try {
            User user = userService.updatePermissions(id, permissions);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            // ✅ Corrected non-static method call
            String jwtToken = jwtUtils.generateToken(user.getUsername());

            return ResponseEntity.ok(new JwtResponse(jwtToken, user.getId(), user.getUsername(), user.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}/notifications")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long id) {
        try {
            List<Notification> notifications = notificationService.getUserNotifications(id);
            return ResponseEntity.ok(notifications);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}