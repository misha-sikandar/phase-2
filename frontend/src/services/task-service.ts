import { apiClient } from './api-client';
import { Task } from '../types/shared-types';

class TaskService {
  async getAllTasks(params?: { status?: string; priority?: string; limit?: number; offset?: number }): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = `/todos${queryString ? '?' + queryString : ''}`;

    const response = await apiClient.get(endpoint);
    // Backend returns: { items: [...], total, limit, offset }
    return response?.items || response || [];
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get(`/todos/${id}`);
    return response;
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const response = await apiClient.post('/todos', taskData);
    return response;
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    const response = await apiClient.put(`/todos/${id}`, taskData);
    return response;
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/todos/${id}`);
  }
}

export const taskService = new TaskService();