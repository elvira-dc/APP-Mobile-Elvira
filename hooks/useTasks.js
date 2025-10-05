import { useGenericCRUD } from "./useGenericCRUD";
import { MOCK_TASKS } from "../constants/mockData";

// Create a mock service adapter for the generic CRUD hook
const createMockTaskService = () => {
  // Store tasks in memory to simulate proper data persistence
  let tasksCache = [...MOCK_TASKS];

  return {
    async fetch() {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, data: tasksCache };
    },

    async create(taskData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newTask = {
        id: Date.now(),
        ...taskData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      tasksCache.push(newTask);
      return { success: true, data: newTask };
    },

    async update(taskId, updateData) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find the original task and merge with update data
      const taskIndex = tasksCache.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        const updatedTask = { ...tasksCache[taskIndex], ...updateData };
        tasksCache[taskIndex] = updatedTask;
        return { success: true, data: updatedTask };
      }

      // Fallback if task not found
      return { success: true, data: { id: taskId, ...updateData } };
    },

    async delete(taskId) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      tasksCache = tasksCache.filter((task) => task.id !== taskId);
      return { success: true };
    },
  };
};

// Custom hook for managing tasks using the generic CRUD hook
export const useTasks = (options = {}) => {
  const mockService = createMockTaskService();

  const crudResult = useGenericCRUD(mockService, {
    initialData: [],
    autoFetch: true,
    optimisticUpdates: true,
    onSuccess: (operation, data) => {
      console.log(`Task ${operation} successful:`, data);
      options.onSuccess?.(operation, data);
    },
    onError: (operation, error) => {
      console.error(`Task ${operation} failed:`, error);
      options.onError?.(operation, error);
    },
    ...options,
  });

  // Legacy method names for backward compatibility
  const legacyMethods = {
    tasks: crudResult.items,
    fetchTasks: crudResult.fetchItems,
    createTask: crudResult.createItem,
    updateTask: crudResult.updateItem,
    deleteTask: crudResult.deleteItem,
  };

  // Additional task-specific methods
  const getTasksByStatus = (status) => {
    return crudResult.items.filter((task) => task.status === status);
  };

  const getTasksByPriority = (priority) => {
    return crudResult.items.filter((task) => task.priority === priority);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return crudResult.items.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "completed"
    );
  };

  const markTaskComplete = async (taskId) => {
    return crudResult.updateItem(taskId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
  };

  // Return combined API with both generic CRUD and legacy methods
  return {
    // Generic CRUD methods
    ...crudResult,

    // Legacy method names for backward compatibility
    ...legacyMethods,

    // Task-specific methods
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    markTaskComplete,

    // Legacy property names
    loading: crudResult.loading,
    error: crudResult.error,
  };
};
