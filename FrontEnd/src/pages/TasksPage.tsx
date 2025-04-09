
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

  // Load tasks from localStorage on initial render
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);
  
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

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully");
  };

  const handleTimeUpdate = (id: string, newTime: number) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, timeLogged: newTime } : task
      )
    );
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
