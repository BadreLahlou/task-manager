package com.badrelahlou.taskmanager.repository;

import com.badrelahlou.taskmanager.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}