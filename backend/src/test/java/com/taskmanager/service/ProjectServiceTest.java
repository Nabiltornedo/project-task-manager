package com.taskmanager.service;

import com.taskmanager.dto.request.ProjectRequest;
import com.taskmanager.dto.response.ProjectResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;
    private ProjectRequest projectRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .email("test@test.com")
                .password("password")
                .role(Role.USER)
                .build();

        testProject = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .owner(testUser)
                .build();
        testProject.setCreatedAt(LocalDateTime.now());
        testProject.setUpdatedAt(LocalDateTime.now());

        projectRequest = ProjectRequest.builder()
                .title("Test Project")
                .description("Test Description")
                .build();
    }

    @Test
    @DisplayName("Should create project successfully")
    void createProject_Success() {
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectResponse response = projectService.createProject(projectRequest, testUser);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Test Project");
        assertThat(response.getDescription()).isEqualTo("Test Description");
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Should get all projects for user")
    void getAllProjects_Success() {
        Project project2 = Project.builder()
                .id(2L)
                .title("Second Project")
                .description("Another description")
                .owner(testUser)
                .build();
        project2.setCreatedAt(LocalDateTime.now());
        project2.setUpdatedAt(LocalDateTime.now());

        when(projectRepository.findByOwnerOrderByCreatedAtDesc(testUser))
                .thenReturn(Arrays.asList(testProject, project2));

        List<ProjectResponse> projects = projectService.getAllProjects(testUser);

        assertThat(projects).hasSize(2);
        assertThat(projects.get(0).getTitle()).isEqualTo("Test Project");
        assertThat(projects.get(1).getTitle()).isEqualTo("Second Project");
    }

    @Test
    @DisplayName("Should get project by ID")
    void getProjectById_Success() {
        when(projectRepository.findByIdAndOwnerWithTasks(1L, testUser))
                .thenReturn(Optional.of(testProject));

        ProjectResponse response = projectService.getProjectById(1L, testUser);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Test Project");
    }

    @Test
    @DisplayName("Should throw exception when project not found")
    void getProjectById_NotFound() {
        when(projectRepository.findByIdAndOwnerWithTasks(99L, testUser))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(99L, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    @DisplayName("Should update project successfully")
    void updateProject_Success() {
        ProjectRequest updateRequest = ProjectRequest.builder()
                .title("Updated Title")
                .description("Updated Description")
                .build();

        when(projectRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectResponse response = projectService.updateProject(1L, updateRequest, testUser);

        assertThat(response).isNotNull();
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Should delete project successfully")
    void deleteProject_Success() {
        when(projectRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testProject));
        doNothing().when(projectRepository).delete(testProject);

        projectService.deleteProject(1L, testUser);

        verify(projectRepository, times(1)).delete(testProject);
    }
}
