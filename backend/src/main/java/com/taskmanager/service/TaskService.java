package com.taskmanager.service;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    
    @Transactional
    public TaskResponse createTask(Long projectId, TaskRequest request, User owner) {
        log.info("Creating task '{}' for project ID: {}", request.getTitle(), projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .project(project)
                .completed(false)
                .build();
        
        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with ID: {}", savedTask.getId());
        
        return TaskResponse.fromEntity(savedTask);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasksForProject(Long projectId, User owner) {
        log.debug("Fetching all tasks for project ID: {}", projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        return taskRepository.findByProjectOrderByCreatedAtDesc(project)
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksPaginated(Long projectId, User owner, Pageable pageable) {
        Project project = projectService.getProjectEntity(projectId, owner);
        
        return taskRepository.findByProject(project, pageable)
                .map(TaskResponse::fromEntity);
    }
    
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long projectId, Long taskId, User owner) {
        log.debug("Fetching task ID: {} from project ID: {}", taskId, projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        return TaskResponse.fromEntity(task);
    }
    
    @Transactional
    public TaskResponse updateTask(Long projectId, Long taskId, TaskRequest request, User owner) {
        log.info("Updating task ID: {} in project ID: {}", taskId, projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        
        Task updatedTask = taskRepository.save(task);
        log.info("Task updated successfully: {}", updatedTask.getId());
        
        return TaskResponse.fromEntity(updatedTask);
    }
    
    @Transactional
    public TaskResponse toggleTaskCompletion(Long projectId, Long taskId, User owner) {
        log.info("Toggling completion status for task ID: {} in project ID: {}", taskId, projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        if (task.isCompleted()) {
            task.markAsIncomplete();
        } else {
            task.markAsCompleted();
        }
        
        Task updatedTask = taskRepository.save(task);
        log.info("Task completion toggled - Task ID: {}, Completed: {}", taskId, updatedTask.isCompleted());
        
        return TaskResponse.fromEntity(updatedTask);
    }
    
    @Transactional
    public TaskResponse markTaskAsCompleted(Long projectId, Long taskId, User owner) {
        log.info("Marking task ID: {} as completed in project ID: {}", taskId, projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        task.markAsCompleted();
        
        Task updatedTask = taskRepository.save(task);
        log.info("Task marked as completed: {}", taskId);
        
        return TaskResponse.fromEntity(updatedTask);
    }
    
    @Transactional
    public void deleteTask(Long projectId, Long taskId, User owner) {
        log.info("Deleting task ID: {} from project ID: {}", taskId, projectId);
        
        Project project = projectService.getProjectEntity(projectId, owner);
        
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        taskRepository.delete(task);
        log.info("Task deleted successfully: {}", taskId);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStatus(Long projectId, boolean completed, User owner) {
        Project project = projectService.getProjectEntity(projectId, owner);
        
        return taskRepository.findByProjectAndCompleted(project, completed)
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByPriority(Long projectId, TaskPriority priority, User owner) {
        Project project = projectService.getProjectEntity(projectId, owner);
        
        return taskRepository.findByProjectAndPriority(project, priority)
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks(Long projectId, User owner) {
        Project project = projectService.getProjectEntity(projectId, owner);
        
        return taskRepository.findOverdueTasks(project, LocalDate.now())
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasks(Long projectId, String query, User owner) {
        Project project = projectService.getProjectEntity(projectId, owner);
        
        return taskRepository.searchTasks(project, query)
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
