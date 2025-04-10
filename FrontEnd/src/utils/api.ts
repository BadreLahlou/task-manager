/**
 * API service for communicating with the backend
 */

import { TaskProps, TaskStatus, TaskPriority } from '@/types/task';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to convert backend task status to frontend task status
const mapBackendStatusToFrontend = (status: string): TaskStatus => {
  switch (status) {
    case 'TODO':
      return 'todo';
    case 'IN_PROGRESS':
      return 'in-progress';
    case 'DONE':
      return 'completed';
    default:
      return 'todo';
  }
};

// Helper function to convert frontend task status to backend task status
const mapFrontendStatusToBackend = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'TODO';
    case 'in-progress':
      return 'IN_PROGRESS';
    case 'completed':
      return 'DONE';
    default:
      return 'TODO';
  }
};

// Helper function to convert backend priority to frontend priority
const mapBackendPriorityToFrontend = (priority: string): TaskPriority => {
  switch (priority) {
    case 'LOW':
      return 'low';
    case 'MEDIUM':
      return 'medium';
    case 'HIGH':
      return 'high';
    default:
      return 'medium';
  }
};

// Helper function to convert frontend priority to backend priority
const mapFrontendPriorityToBackend = (priority: TaskPriority): string => {
  switch (priority) {
    case 'low':
      return 'LOW';
    case 'medium':
      return 'MEDIUM';
    case 'high':
      return 'HIGH';
    default:
      return 'MEDIUM';
  }
};

// Convert backend task to frontend task format
const convertBackendTaskToFrontend = (backendTask: any): TaskProps => {
  // Format the date in a more readable format
  let formattedDueDate;
  if (backendTask.endTime) {
    const dueDate = new Date(backendTask.endTime);
    formattedDueDate = `${dueDate.toLocaleString('default', { month: 'short' })} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
  }

  return {
    id: backendTask.id.toString(),
    title: backendTask.title,
    description: backendTask.description || undefined,
    priority: mapBackendPriorityToFrontend(backendTask.priority),
    status: mapBackendStatusToFrontend(backendTask.status),
    dueDate: formattedDueDate,
    timeLogged: backendTask.timeSpent ? backendTask.timeSpent * 60 : 0, // Convert minutes to seconds
  };
};

// Convert frontend task to backend task format
const convertFrontendTaskToBackend = (frontendTask: TaskProps): any => {
  return {
    id: parseInt(frontendTask.id) || null,
    title: frontendTask.title,
    description: frontendTask.description || '',
    priority: mapFrontendPriorityToBackend(frontendTask.priority),
    status: mapFrontendStatusToBackend(frontendTask.status),
    endTime: frontendTask.dueDate ? new Date(frontendTask.dueDate).toISOString() : null,
    timeSpent: frontendTask.timeLogged ? Math.floor(frontendTask.timeLogged / 60) : 0, // Convert seconds to minutes
  };
};

// API functions
export const taskApi = {
  // Get all tasks
  getAllTasks: async (): Promise<TaskProps[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      return data.content.map(convertBackendTaskToFrontend);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback to localStorage if API fails
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<TaskProps | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      return convertBackendTaskToFrontend(data);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return null;
    }
  },

  // Create a new task
  createTask: async (task: Omit<TaskProps, 'id'>): Promise<TaskProps | null> => {
    try {
      const taskToCreate = {
        ...task,
        id: '0', // Temporary ID that will be replaced by the backend
      };
      
      // Convert to backend format
      const backendTask = convertFrontendTaskToBackend(taskToCreate as TaskProps);
      
      // Ensure required fields are set
      if (!backendTask.startTime) {
        backendTask.startTime = new Date().toISOString();
      }
      if (!backendTask.endTime && task.dueDate) {
        backendTask.endTime = new Date(task.dueDate).toISOString();
      } else if (!backendTask.endTime) {
        // Set default end time to 1 day from now if not provided
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        backendTask.endTime = tomorrow.toISOString();
      }
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: backendTask,
          dependencyIds: [] // No dependencies for now
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const data = await response.json();
      return convertBackendTaskToFrontend(data);
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // Update a task
  updateTask: async (id: string, task: TaskProps): Promise<TaskProps | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertFrontendTaskToBackend(task)),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const data = await response.json();
      return convertBackendTaskToFrontend(data);
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return null;
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      return false;
    }
  },

  // Start timer for a task
  startTimer: async (id: string): Promise<TaskProps | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/start`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start timer');
      }
      
      const data = await response.json();
      return convertBackendTaskToFrontend(data);
    } catch (error) {
      console.error(`Error starting timer for task ${id}:`, error);
      return null;
    }
  },

  // Stop timer for a task
  stopTimer: async (id: string): Promise<TaskProps | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/stop`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to stop timer');
      }
      
      const data = await response.json();
      return convertBackendTaskToFrontend(data);
    } catch (error) {
      console.error(`Error stopping timer for task ${id}:`, error);
      return null;
    }
  },

  // Assign task to user
  assignTaskToUser: async (taskId: string, userId: string): Promise<TaskProps | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userId),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign task');
      }
      
      const data = await response.json();
      return convertBackendTaskToFrontend(data);
    } catch (error) {
      console.error(`Error assigning task ${taskId} to user ${userId}:`, error);
      return null;
    }
  },
};