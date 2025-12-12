package com.taskmanager.repository;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);
    
    Page<Project> findByOwner(User owner, Pageable pageable);
    
    Optional<Project> findByIdAndOwner(Long id, User owner);
    
    boolean existsByIdAndOwner(Long id, User owner);
    
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id AND p.owner = :owner")
    Optional<Project> findByIdAndOwnerWithTasks(@Param("id") Long id, @Param("owner") User owner);
    
    @Query("SELECT p FROM Project p WHERE p.owner = :owner AND LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Project> searchByTitle(@Param("owner") User owner, @Param("search") String search);
    
    long countByOwner(User owner);
}
