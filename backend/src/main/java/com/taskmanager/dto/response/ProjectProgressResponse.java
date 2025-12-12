package com.taskmanager.dto.response;

import com.taskmanager.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectProgressResponse {
    
    private Long projectId;
    private String projectTitle;
    private int totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double progressPercentage;
    private String status;
    
    public static ProjectProgressResponse fromEntity(Project project) {
        int total = project.getTotalTasks();
        long completed = project.getCompletedTasks();
        long pending = total - completed;
        double percentage = project.getProgressPercentage();
        
        String status;
        if (total == 0) {
            status = "NO_TASKS";
        } else if (percentage == 100) {
            status = "COMPLETED";
        } else if (percentage >= 75) {
            status = "ALMOST_DONE";
        } else if (percentage >= 50) {
            status = "IN_PROGRESS";
        } else if (percentage > 0) {
            status = "STARTED";
        } else {
            status = "NOT_STARTED";
        }
        
        return ProjectProgressResponse.builder()
                .projectId(project.getId())
                .projectTitle(project.getTitle())
                .totalTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .progressPercentage(Math.round(percentage * 100.0) / 100.0)
                .status(status)
                .build();
    }
}
