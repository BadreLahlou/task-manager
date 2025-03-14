package com.badrelahlou.taskmanager.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.badrelahlou.taskmanager.model.Resource; // Add this import
import com.badrelahlou.taskmanager.model.Task;
import com.badrelahlou.taskmanager.model.TaskStatus;
import com.badrelahlou.taskmanager.model.User;
import com.badrelahlou.taskmanager.repository.ResourceRepository;
import com.badrelahlou.taskmanager.repository.TaskRepository;
import com.badrelahlou.taskmanager.repository.UserRepository;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ResourceRepository resourceRepository; // Add this field

    public Task createTask(Task task, List<Long> dependencyIds) {
        if (dependencyIds != null && !dependencyIds.isEmpty()) {
            List<Task> dependencies = taskRepository.findAllById(dependencyIds);
            task.setDependencies(dependencies);
        }
        task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
    }

    public Task startTimer(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        if (task.getStartTime() != null) {
            throw new RuntimeException("Timer is already running for task id: " + taskId);
        }
        task.setStartTime(LocalDateTime.now());
        task.setStatus(TaskStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }

    public Task stopTimer(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        if (task.getStartTime() == null) {
            throw new RuntimeException("Timer has not been started for task id: " + taskId);
        }
        if (task.getEndTime() != null) {
            throw new RuntimeException("Timer is already stopped for task id: " + taskId);
        }
        task.setEndTime(LocalDateTime.now());
        task.calculateTimeSpent();
        task.setStatus(TaskStatus.DONE);

        // Notify dependent tasks
        taskRepository.findAll().stream()
        .filter(t -> t.getDependencies().contains(task) && t.getStatus() != TaskStatus.DONE)
                .forEach(t -> notificationService.createNotification(t.getAssignedUser(),
                        "Dependency '" + task.getTitle() + "' completed for task '" + t.getTitle() + "'"));

        return taskRepository.save(task);
    }

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setStatus(updatedTask.getStatus());
        task.setSubtasks(updatedTask.getSubtasks());
        task.setRecurrenceRule(updatedTask.getRecurrenceRule());
        task.setResources(updatedTask.getResources());
    
        // ✅ Send notification when task status changes
        if (!task.getStatus().equals(updatedTask.getStatus())) {
            notificationService.createNotification(task.getAssignedUser(), 
                "Your task '" + task.getTitle() + "' status changed to " + updatedTask.getStatus());
        }
    
        return taskRepository.save(task);
    }
    

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public Task assignTaskToUser(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        task.setAssignedUser(user);
        task = taskRepository.save(task);
        notificationService.createNotification(user, "Task '" + task.getTitle() + "' has been assigned to you.");
        return task;
    }

    public Task assignResources(Long taskId, List<Long> resourceIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        List<Resource> resources = resourceRepository.findAllById(resourceIds);
        task.setResources(resources);
        return taskRepository.save(task);
    }
}