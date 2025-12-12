package com.taskmanager.repository;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByProjectOrderByCreatedAtDesc(Project project);
    
    Page<Task> findByProject(Project project, Pageable pageable);
    
    Optional<Task> findByIdAndProject(Long id, Project project);
    
    List<Task> findByProjectAndCompleted(Project project, boolean completed);
    
    List<Task> findByProjectAndPriority(Project project, TaskPriority priority);
    
    @Query("SELECT t FROM Task t WHERE t.project = :project AND t.dueDate < :date AND t.completed = false")
    List<Task> findOverdueTasks(@Param("project") Project project, @Param("date") LocalDate date);
    
    @Query("SELECT t FROM Task t WHERE t.project = :project AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Task> searchTasks(@Param("project") Project project, @Param("search") String search);
    
    @Query("SELECT t FROM Task t WHERE t.project.owner.id = :userId ORDER BY t.dueDate ASC NULLS LAST")
    List<Task> findAllTasksByUserOrderByDueDate(@Param("userId") Long userId);
    
    long countByProjectAndCompleted(Project project, boolean completed);
    
    long countByProject(Project project);
}
