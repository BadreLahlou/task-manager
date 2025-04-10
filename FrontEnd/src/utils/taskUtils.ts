
import { TaskProps } from '@/types/task';
import { taskApi } from './api';

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const filterTasks = (
  tasks: TaskProps[], 
  statusFilter: string, 
  priorityFilter: string | null, 
  searchQuery: string
): TaskProps[] => {
  return tasks
    .filter(task => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'todo') return task.status === 'todo';
      if (statusFilter === 'in-progress') return task.status === 'in-progress';
      if (statusFilter === 'completed') return task.status === 'completed';
      return true;
    })
    .filter(task => {
      if (!priorityFilter) return true;
      return task.priority === priorityFilter;
    })
    .filter(task => {
      if (!searchQuery) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
    });
};

// Save tasks to backend API
export const saveTasks = async (tasks: TaskProps[]) => {
  // This function is kept for backward compatibility with existing code
  // In the new API-based approach, we don't need to explicitly save all tasks at once
  // as each task is saved individually when created or updated
  
  // For backward compatibility during transition, also save to localStorage
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load tasks from backend API
export const loadTasks = async (): Promise<TaskProps[]> => {
  try {
    // Try to fetch tasks from the backend API
    const tasks = await taskApi.getAllTasks();
    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks from API, falling back to localStorage:', error);
    
    // Fallback to localStorage if API fails
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error('Failed to parse saved tasks:', e);
        return [];
      }
    }
    return [];
  }
};

// Non-async wrapper for components that haven't been updated to use async/await
export const loadTasksSync = (): TaskProps[] => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
    } catch (e) {
      console.error('Failed to parse saved tasks:', e);
      return [];
    }
  }
  return [];
};

// Initialize tasks from API and update localStorage
export const initializeTasks = async (): Promise<void> => {
  try {
    const tasks = await taskApi.getAllTasks();
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to initialize tasks from API:', error);
  }
};

// Create a new task using the API
export const createTask = async (task: Omit<TaskProps, 'id'>): Promise<TaskProps | null> => {
  return await taskApi.createTask(task);
};

// Update a task using the API
export const updateTask = async (id: string, task: TaskProps): Promise<TaskProps | null> => {
  return await taskApi.updateTask(id, task);
};

// Delete a task using the API
export const deleteTask = async (id: string): Promise<boolean> => {
  return await taskApi.deleteTask(id);
};

// Start timer for a task using the API
export const startTimer = async (id: string): Promise<TaskProps | null> => {
  return await taskApi.startTimer(id);
};

// Stop timer for a task using the API
export const stopTimer = async (id: string): Promise<TaskProps | null> => {
  return await taskApi.stopTimer(id);
};
