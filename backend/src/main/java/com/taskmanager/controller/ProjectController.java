package com.taskmanager.controller;

import com.taskmanager.dto.request.ProjectRequest;
import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.dto.response.ProjectProgressResponse;
import com.taskmanager.dto.response.ProjectResponse;
import com.taskmanager.entity.User;
import com.taskmanager.service.ProjectService;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management APIs")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {
    
    private final ProjectService projectService;
    
    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User currentUser) {
        ProjectResponse project = projectService.createProject(request, currentUser);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", project));
    }
    
    @GetMapping
    @Operation(summary = "Get all projects for the authenticated user")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects(
            @AuthenticationPrincipal User currentUser) {
        List<ProjectResponse> projects = projectService.getAllProjects(currentUser);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
    
    @GetMapping("/paginated")
    @Operation(summary = "Get all projects with pagination")
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> getProjectsPaginated(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ProjectResponse> projects = projectService.getProjectsPaginated(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get a project by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        ProjectResponse project = projectService.getProjectById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(project));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a project")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User currentUser) {
        ProjectResponse project = projectService.updateProject(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        projectService.deleteProject(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
    
    @GetMapping("/{id}/progress")
    @Operation(summary = "Get project progress statistics")
    public ResponseEntity<ApiResponse<ProjectProgressResponse>> getProjectProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        ProjectProgressResponse progress = projectService.getProjectProgress(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search projects by title")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> searchProjects(
            @RequestParam String query,
            @AuthenticationPrincipal User currentUser) {
        List<ProjectResponse> projects = projectService.searchProjects(query, currentUser);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
}
