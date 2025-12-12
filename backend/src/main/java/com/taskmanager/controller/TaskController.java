package com.taskmanager.controller;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.User;
import com.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management APIs")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {
    
    private final TaskService taskService;
    
    @PostMapping
    @Operation(summary = "Create a new task in a project")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser) {
        TaskResponse task = taskService.createTask(projectId, request, currentUser);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }
    
    @GetMapping
    @Operation(summary = "Get all tasks for a project")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User currentUser) {
        List<TaskResponse> tasks = taskService.getAllTasksForProject(projectId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @GetMapping("/paginated")
    @Operation(summary = "Get all tasks with pagination")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getTasksPaginated(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<TaskResponse> tasks = taskService.getTasksPaginated(projectId, currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @GetMapping("/{taskId}")
    @Operation(summary = "Get a task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User currentUser) {
        TaskResponse task = taskService.getTaskById(projectId, taskId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(task));
    }
    
    @PutMapping("/{taskId}")
    @Operation(summary = "Update a task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser) {
        TaskResponse task = taskService.updateTask(projectId, taskId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }
    
    @PatchMapping("/{taskId}/toggle")
    @Operation(summary = "Toggle task completion status")
    public ResponseEntity<ApiResponse<TaskResponse>> toggleTaskCompletion(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User currentUser) {
        TaskResponse task = taskService.toggleTaskCompletion(projectId, taskId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task status toggled", task));
    }
    
    @PatchMapping("/{taskId}/complete")
    @Operation(summary = "Mark task as completed")
    public ResponseEntity<ApiResponse<TaskResponse>> markTaskAsCompleted(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User currentUser) {
        TaskResponse task = taskService.markTaskAsCompleted(projectId, taskId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task marked as completed", task));
    }
    
    @DeleteMapping("/{taskId}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User currentUser) {
        taskService.deleteTask(projectId, taskId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
    
    @GetMapping("/status/{completed}")
    @Operation(summary = "Get tasks by completion status")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByStatus(
            @PathVariable Long projectId,
            @PathVariable boolean completed,
            @AuthenticationPrincipal User currentUser) {
        List<TaskResponse> tasks = taskService.getTasksByStatus(projectId, completed, currentUser);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @GetMapping("/priority/{priority}")
    @Operation(summary = "Get tasks by priority")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByPriority(
            @PathVariable Long projectId,
            @PathVariable TaskPriority priority,
            @AuthenticationPrincipal User currentUser) {
        List<TaskResponse> tasks = taskService.getTasksByPriority(projectId, priority, currentUser);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @GetMapping("/overdue")
    @Operation(summary = "Get overdue tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getOverdueTasks(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User currentUser) {
        List<TaskResponse> tasks = taskService.getOverdueTasks(projectId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> searchTasks(
            @PathVariable Long projectId,
            @RequestParam String query,
            @AuthenticationPrincipal User currentUser) {
        List<TaskResponse> tasks = taskService.searchTasks(projectId, query, currentUser);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
}
