
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskProps, TaskStatus } from '@/types/task';
import { filterTasks, loadTasks, saveTasks } from '@/utils/taskUtils';
import { toast } from 'sonner';

// Import our new components
import { TaskHeader } from '@/components/tasks/TaskHeader';
import { TaskSearchBar } from '@/components/tasks/TaskSearchBar';
import { TaskFilterDrawer } from '@/components/tasks/TaskFilterDrawer';
import { TaskCreateDialog } from '@/components/tasks/TaskCreateDialog';
import { TaskList } from '@/components/tasks/TaskList';

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Load tasks from API on initial render
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await loadTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      }
    };
    
    fetchTasks();
  }, []);

  // We don't need to save tasks on every change anymore
  // as each task operation (create, update, delete) is handled by the API
  
  // Apply filters to get the tasks that should be displayed
  const filteredTasks = filterTasks(tasks, activeFilter, priorityFilter, searchQuery);

  const handleCreateTask = (newTask: TaskProps) => {
    setTasks(prev => [...prev, newTask]);
    console.log("Task created, dialog should close now");
  };

  const handleOpenTaskDialog = () => {
    console.log("Opening task dialog");
    setShowNewTaskDialog(true);
  };

  const handleCloseTaskDialog = (isOpen: boolean) => {
    console.log("Dialog state changing to:", isOpen);
    setShowNewTaskDialog(isOpen);
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      // Find the task to update
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      // Create updated task with new status
      const updatedTaskData = { ...taskToUpdate, status: newStatus };
      
      // Update local state immediately for responsive UI
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? updatedTaskData : task
        )
      );
      
      // Update in the backend
      const { updateTask } = await import('@/utils/taskUtils');
      await updateTask(id, updatedTaskData);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      // Update local state immediately for responsive UI
      setTasks(prev => prev.filter(task => task.id !== id));
      
      // Delete from the backend
      const { deleteTask } = await import('@/utils/taskUtils');
      const success = await deleteTask(id);
      
      if (success) {
        toast.success("Task deleted successfully");
      } else {
        // If backend deletion fails, revert the local state change
        const { loadTasks } = await import('@/utils/taskUtils');
        const refreshedTasks = await loadTasks();
        setTasks(refreshedTasks);
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleTimeUpdate = async (id: string, newTime: number) => {
    try {
      // Find the task to update
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      // Create updated task with new time
      const updatedTaskData = { ...taskToUpdate, timeLogged: newTime };
      
      // Update local state immediately for responsive UI
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? updatedTaskData : task
        )
      );
      
      // We don't update the backend on every time update as that would create too many requests
      // The backend will be updated when the timer is stopped or started
    } catch (error) {
      console.error('Error updating task time:', error);
    }
  };

  const hasFilters = !!priorityFilter || !!searchQuery;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in dashboard-content">
      {/* Header with title and main action buttons */}
      <TaskHeader 
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onOpenFilterDrawer={() => setOpenFilterDrawer(true)}
        onOpenNewTaskDialog={handleOpenTaskDialog}
      />
      
      {/* Search bar */}
      <TaskSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Tabs for filtering by status */}
      <div className="mb-5">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-purple-50 dark:bg-card/60 p-1 rounded-xl">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveFilter('all')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="todo" 
              onClick={() => setActiveFilter('todo')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress" 
              onClick={() => setActiveFilter('in-progress')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              onClick={() => setActiveFilter('completed')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          
          {/* Tab content */}
          <TabsContent value="all" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
          
          <TabsContent value="todo" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs and drawers */}
      <TaskFilterDrawer 
        open={openFilterDrawer}
        onOpenChange={setOpenFilterDrawer}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <TaskCreateDialog 
        open={showNewTaskDialog}
        onOpenChange={handleCloseTaskDialog}
        onTaskCreate={handleCreateTask}
      />
    </div>
  );
};

export default TasksPage;
