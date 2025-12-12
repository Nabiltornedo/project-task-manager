package com.taskmanager.dto.response;

import com.taskmanager.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    
    private Long id;
    private String title;
    private String description;
    private String ownerName;
    private int totalTasks;
    private long completedTasks;
    private double progressPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ProjectResponse fromEntity(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .ownerName(project.getOwner().getFullName())
                .totalTasks(project.getTotalTasks())
                .completedTasks(project.getCompletedTasks())
                .progressPercentage(Math.round(project.getProgressPercentage() * 100.0) / 100.0)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
