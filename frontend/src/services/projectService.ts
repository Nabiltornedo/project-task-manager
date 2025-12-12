import api from './api';
import { ApiResponse, Project, ProjectRequest, ProjectProgress } from '../types';

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },

  async getProjectById(id: number): Promise<Project> {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  async createProject(data: ProjectRequest): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  async updateProject(id: number, data: ProjectRequest): Promise<Project> {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async getProjectProgress(id: number): Promise<ProjectProgress> {
    const response = await api.get<ApiResponse<ProjectProgress>>(`/projects/${id}/progress`);
    return response.data.data;
  },

  async searchProjects(query: string): Promise<Project[]> {
    const response = await api.get<ApiResponse<Project[]>>(`/projects/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};
