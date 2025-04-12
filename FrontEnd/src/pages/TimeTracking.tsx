import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BarChart4, Calendar, Filter } from 'lucide-react';
import { TaskProps } from '@/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimerButton } from '@/components/TimerButton';
import { toast } from 'sonner';
import { taskApi } from '@/utils/api';

const TimeTracking = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await taskApi.getAllTasks();
        setTasks(fetchedTasks);
        
        
        const inProgressTask = fetchedTasks.find(task => task.status === 'in-progress');
        if (inProgressTask) {
          setActiveTask(inProgressTask.id);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const formatTime = (seconds?: number) => {
    if (!seconds) return '0h 0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const totalTimeLogged = tasks.reduce((total, task) => total + (task.timeLogged || 0), 0);
  
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const getFilteredTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(today - (now.getDay() * 24 * 60 * 60 * 1000)).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    let filteredTasks = tasks.filter(task => (task.timeLogged || 0) > 0);
    
    if (timeFilter === 'today') {
      return filteredTasks;
    } else if (timeFilter === 'week') {
      return filteredTasks;
    } else if (timeFilter === 'month') {
      return filteredTasks;
    }
    
    return filteredTasks;
  };
  
  const filteredTasks = getFilteredTasks();

  const handleTimeUpdate = (taskId: string, newTime: number) => {
    
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
   
    const updatedTask = { ...taskToUpdate, timeLogged: newTime };
    
    
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? updatedTask : task
      )
    );
    
    
  };

  const handleStartTimer = async (taskId: string) => {
    try {
      
      if (activeTask && activeTask !== taskId) {
        
        await taskApi.stopTimer(activeTask);
        
        
        setTasks(prev => 
          prev.map(task => 
            task.id === activeTask ? { ...task, status: 'todo' } : task
          )
        );
        toast.info("Previous timer paused");
      }
      
      
      const updatedTask = await taskApi.startTimer(taskId);
      
      if (updatedTask) {
       
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId ? updatedTask : task
          )
        );
        setActiveTask(taskId);
        toast.success("Timer started");
      } else {
        toast.error("Failed to start timer");
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error("Failed to start timer");
    }
  };

  const handlePauseTimer = async (taskId: string) => {
    try {
      
      const updatedTask = await taskApi.stopTimer(taskId);
      
      if (updatedTask) {
        
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId ? updatedTask : task
          )
        );
        setActiveTask(null);
        toast.info("Timer stopped");
      } else {
        toast.error("Failed to stop timer");
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error("Failed to stop timer");
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground">Monitor time spent on tasks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={timeFilter} 
            onValueChange={setTimeFilter}
          >
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Calendar className="h-3.5 w-3.5" />
            Date Range
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-xl p-1 shadow-md">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold">{formatTime(totalTimeLogged)}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl p-1 shadow-md">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl p-1 shadow-md">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-card rounded-xl border shadow-md dark:bg-card dark:border-border overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Time Logs</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center rounded-b-xl">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-muted rounded mb-2"></div>
              <div className="h-3 w-48 bg-muted rounded"></div>
            </div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="divide-y dark:divide-border">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-5 flex justify-between items-center">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Status: {task.status === 'todo' ? 'To Do' : 
                             task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{formatTime(task.timeLogged)}</span>
                  </div>
                  
                  {task.status !== 'completed' && (
                    <TimerButton
                      isRunning={task.status === 'in-progress'}
                      timeLogged={task.timeLogged || 0}
                      onTimeUpdate={(newTime) => handleTimeUpdate(task.id, newTime)}
                      onStart={() => handleStartTimer(task.id)}
                      onPause={() => handlePauseTimer(task.id)}
                      className="h-8 text-xs rounded-xl"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-b-xl">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No time tracked yet</h3>
            <p className="text-muted-foreground mt-1">Start a task timer to begin tracking time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;
