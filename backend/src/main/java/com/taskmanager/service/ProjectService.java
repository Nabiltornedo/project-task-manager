package com.taskmanager.service;

import com.taskmanager.dto.request.ProjectRequest;
import com.taskmanager.dto.response.ProjectProgressResponse;
import com.taskmanager.dto.response.ProjectResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    
    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User owner) {
        log.info("Creating project '{}' for user: {}", request.getTitle(), owner.getEmail());
        
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(owner)
                .build();
        
        Project savedProject = projectRepository.save(project);
        log.info("Project created successfully with ID: {}", savedProject.getId());
        
        return ProjectResponse.fromEntity(savedProject);
    }
    
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(User owner) {
        log.debug("Fetching all projects for user: {}", owner.getEmail());
        
        return projectRepository.findByOwnerOrderByCreatedAtDesc(owner)
                .stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjectsPaginated(User owner, Pageable pageable) {
        return projectRepository.findByOwner(owner, pageable)
                .map(ProjectResponse::fromEntity);
    }
    
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, User owner) {
        log.debug("Fetching project with ID: {} for user: {}", id, owner.getEmail());
        
        Project project = projectRepository.findByIdAndOwnerWithTasks(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        return ProjectResponse.fromEntity(project);
    }
    
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, User owner) {
        log.info("Updating project with ID: {} for user: {}", id, owner.getEmail());
        
        Project project = projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        
        Project updatedProject = projectRepository.save(project);
        log.info("Project updated successfully: {}", updatedProject.getId());
        
        return ProjectResponse.fromEntity(updatedProject);
    }
    
    @Transactional
    public void deleteProject(Long id, User owner) {
        log.info("Deleting project with ID: {} for user: {}", id, owner.getEmail());
        
        Project project = projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        projectRepository.delete(project);
        log.info("Project deleted successfully: {}", id);
    }
    
    @Transactional(readOnly = true)
    public ProjectProgressResponse getProjectProgress(Long id, User owner) {
        log.debug("Fetching progress for project ID: {}", id);
        
        Project project = projectRepository.findByIdAndOwnerWithTasks(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        return ProjectProgressResponse.fromEntity(project);
    }
    
    @Transactional(readOnly = true)
    public List<ProjectResponse> searchProjects(String query, User owner) {
        log.debug("Searching projects with query: '{}' for user: {}", query, owner.getEmail());
        
        return projectRepository.searchByTitle(owner, query)
                .stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Internal method to get Project entity
    @Transactional(readOnly = true)
    public Project getProjectEntity(Long id, User owner) {
        return projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }
}
