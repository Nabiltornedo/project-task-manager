package com.taskmanager.dto.response;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean completed;
    private LocalDateTime completedAt;
    private TaskPriority priority;
    private boolean overdue;
    private Long projectId;
    private String projectTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static TaskResponse fromEntity(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .completed(task.isCompleted())
                .completedAt(task.getCompletedAt())
                .priority(task.getPriority())
                .overdue(task.isOverdue())
                .projectId(task.getProject().getId())
                .projectTitle(task.getProject().getTitle())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
