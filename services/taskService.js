import apiClient from "./apiClient";
import { API_CONFIG } from "@constants/api";

class TaskService {
  // Get all tasks
  async getTasks(filters = {}) {
    try {
      const params = {
        ...filters,
        limit: filters.limit || API_CONFIG.PAGINATION_LIMIT,
      };

      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.TASKS.LIST,
        params
      );
      return {
        success: true,
        data: response.data || response,
        meta: response.meta || {},
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get task by ID
  async getTaskById(taskId) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.TASKS.BY_ID.replace(":id", taskId);
      const response = await apiClient.get(endpoint);

      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create new task
  async createTask(taskData) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.TASKS.CREATE,
        taskData
      );

      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update task
  async updateTask(taskId, updateData) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.TASKS.UPDATE;
      const response = await apiClient.put(`${endpoint}/${taskId}`, updateData);

      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete task
  async deleteTask(taskId) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.TASKS.DELETE;
      await apiClient.delete(`${endpoint}/${taskId}`);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update task status
  async updateTaskStatus(taskId, status) {
    try {
      const updateData = { status };
      return await this.updateTask(taskId, updateData);
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Assign task to staff member
  async assignTask(taskId, staffId) {
    try {
      const updateData = { assignedTo: staffId };
      return await this.updateTask(taskId, updateData);
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get tasks by status
  async getTasksByStatus(status, filters = {}) {
    try {
      return await this.getTasks({ ...filters, status });
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get tasks by assignee
  async getTasksByAssignee(staffId, filters = {}) {
    try {
      return await this.getTasks({ ...filters, assignedTo: staffId });
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Create singleton instance
const taskService = new TaskService();

export default taskService;
