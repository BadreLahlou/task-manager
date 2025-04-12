
import { TaskProps, TaskStatus, TaskPriority } from '@/types/task';


const API_BASE_URL = 'http://localhost:8080/api';


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


const convertBackendTaskToFrontend = (backendTask: any): TaskProps => {

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
    timeLogged: backendTask.timeSpent ? backendTask.timeSpent * 60 : 0, 
  };
};


const convertFrontendTaskToBackend = (frontendTask: TaskProps): any => {
  return {
    id: parseInt(frontendTask.id) || null,
    title: frontendTask.title,
    description: frontendTask.description || '',
    priority: mapFrontendPriorityToBackend(frontendTask.priority),
    status: mapFrontendStatusToBackend(frontendTask.status),
    endTime: frontendTask.dueDate ? new Date(frontendTask.dueDate).toISOString() : null,
    timeSpent: frontendTask.timeLogged ? Math.floor(frontendTask.timeLogged / 60) : 0, 
  };
};


export const taskApi = {
 
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
     
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
  },

  
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

  
  createTask: async (task: Omit<TaskProps, 'id'>): Promise<TaskProps | null> => {
    try {
      const taskToCreate = {
        ...task,
        id: '0', 
      };
      
     
      const backendTask = convertFrontendTaskToBackend(taskToCreate as TaskProps);
      
     
      if (!backendTask.startTime) {
        backendTask.startTime = new Date().toISOString();
      }
      if (!backendTask.endTime && task.dueDate) {
        backendTask.endTime = new Date(task.dueDate).toISOString();
      } else if (!backendTask.endTime) {
       
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
          dependencyIds: []
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
