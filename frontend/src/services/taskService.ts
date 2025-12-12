import api from './api';
import { ApiResponse, Task, TaskRequest, TaskPriority } from '../types';

export const taskService = {
  async getAllTasks(projectId: number): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
    return response.data.data;
  },

  async getTaskById(projectId: number, taskId: number): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`);
    return response.data.data;
  },

  async createTask(projectId: number, data: TaskRequest): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data);
    return response.data.data;
  },

  async updateTask(projectId: number, taskId: number, data: TaskRequest): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data.data;
  },

  async deleteTask(projectId: number, taskId: number): Promise<void> {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  },

  async toggleTaskCompletion(projectId: number, taskId: number): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}/toggle`);
    return response.data.data;
  },

  async markTaskAsCompleted(projectId: number, taskId: number): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}/complete`);
    return response.data.data;
  },

  async getTasksByStatus(projectId: number, completed: boolean): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks/status/${completed}`);
    return response.data.data;
  },

  async getTasksByPriority(projectId: number, priority: TaskPriority): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks/priority/${priority}`);
    return response.data.data;
  },

  async getOverdueTasks(projectId: number): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks/overdue`);
    return response.data.data;
  },

  async searchTasks(projectId: number, query: string): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};
