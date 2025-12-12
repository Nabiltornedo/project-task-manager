package com.taskmanager.dto.request;

import com.taskmanager.entity.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    
    @NotBlank(message = "Task title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    private String title;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    private LocalDate dueDate;
    
    private TaskPriority priority;
}
