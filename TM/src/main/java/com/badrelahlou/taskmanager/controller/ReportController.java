package com.badrelahlou.taskmanager.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.badrelahlou.taskmanager.model.Task; // ✅ Ensure TaskStatus is imported
import com.badrelahlou.taskmanager.model.TaskStatus;
import com.badrelahlou.taskmanager.service.TaskService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private TaskService taskService;

    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')") // ✅ Only Admins & PMs can view reports
    @GetMapping("/task-completion")
    public Map<String, Object> getTaskCompletionReport() {
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE); // Adjust the page size as needed
        List<Task> tasks = taskService.getAllTasks(pageable).getContent();
        long totalTasks = tasks.size();

        // ✅ Compare TaskStatus ENUM instead of String
        long completedTasks = tasks.stream().filter(t -> TaskStatus.DONE.equals(t.getStatus())).count();
        long inProgressTasks = tasks.stream().filter(t -> TaskStatus.IN_PROGRESS.equals(t.getStatus())).count();
        long todoTasks = tasks.stream().filter(t -> TaskStatus.TODO.equals(t.getStatus())).count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalTasks", totalTasks);
        report.put("completedTasks", completedTasks);
        report.put("inProgressTasks", inProgressTasks);
        report.put("todoTasks", todoTasks);
        return report;
    }
}
