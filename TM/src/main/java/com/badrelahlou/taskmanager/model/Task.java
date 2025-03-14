package com.badrelahlou.taskmanager.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tasks")
@Data // Generates getters, setters, toString, equals, hashCode
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
     private LocalDateTime endTime;

    @Column
    private Long timeSpent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @ManyToMany
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_id")
    )
    private List<Task> dependencies;

    // Additional Fields for Auditing and Scheduling (already present)
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private String createdBy; // Reference to User who created the task

    // New Fields to Resolve Errors
    @Column
    private String recurrenceRule; // For Quartz scheduling (e.g., cron expression)

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> subtasks; // Hierarchical task structure

    @ManyToMany
    @JoinTable(
        name = "task_resources",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "resource_id")
    )
    private List<Resource> resources; // Resources associated with the task

    @ManyToOne
    @JoinColumn(name = "parent_task_id")
    private Task parentTask; // Bidirectional relationship for subtasks

    // Method to calculate time spent (already present)
    public void calculateTimeSpent() {
        if (startTime != null && endTime != null) {
            Duration duration = Duration.between(startTime, endTime);
            this.timeSpent = duration.toMinutes();
        } else {
            this.timeSpent = 0L;
        }
    }
}