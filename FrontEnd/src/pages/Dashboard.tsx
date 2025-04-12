import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ArrowUpRight, 
  ClipboardList, 
  ClipboardCheck, 
  Clock, 
  Calendar, 
  BarChart4, 
  Users,
  Star,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskProps } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/components/reports/utils';

const Dashboard = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [todayDate, setTodayDate] = useState('');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
       
        const { loadTasks } = await import('@/utils/taskUtils');
        const fetchedTasks = await loadTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast.error('Failed to load tasks');
      }
    };
    
    fetchTasks();
    
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setTodayDate(today.toLocaleDateString('en-US', options));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  
  const totalTimeLogged = tasks.reduce((total, task) => total + (task.timeLogged || 0), 0);
  
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedPendingTasks = [...tasks]
    .filter(task => task.status !== 'completed')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 3);

  const recentlyCompletedTasks = [...tasks]
    .filter(task => task.status === 'completed')
    .slice(0, 3);

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'todo': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch(priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6 px-2">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Today is {todayDate}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
        <Card className="border-purple-100 dark:border-border shadow-sm hover:shadow transition-all duration-300 bg-gradient-to-br from-white to-purple-50 dark:from-card dark:to-card rounded-2xl p-2">
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl flex justify-between items-center">
              {totalTasks}
              <ClipboardList className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-purple-600 dark:text-purple-400">{completedTasks}</span> completed
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-100 dark:border-border shadow-sm hover:shadow transition-all duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-card dark:to-card rounded-2xl p-2">
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl flex justify-between items-center">
              {inProgressTasks}
              <Clock className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-blue-600 dark:text-blue-400">{todoTasks}</span> to do
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-100 dark:border-border shadow-sm hover:shadow transition-all duration-300 bg-gradient-to-br from-white to-red-50 dark:from-card dark:to-card rounded-2xl p-2">
          <CardHeader className="pb-2">
            <CardDescription>High Priority</CardDescription>
            <CardTitle className="text-3xl flex justify-between items-center">
              {highPriorityTasks}
              <Star className="h-6 w-6 text-red-500 dark:text-red-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Requiring immediate attention
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-100 dark:border-border shadow-sm hover:shadow transition-all duration-300 bg-gradient-to-br from-white to-green-50 dark:from-card dark:to-card rounded-2xl p-2">
          <CardHeader className="pb-2">
            <CardDescription>Time Logged</CardDescription>
            <CardTitle className="text-3xl flex justify-between items-center">
              {formatTime(totalTimeLogged)}
              <Clock className="h-6 w-6 text-green-500 dark:text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Across all your tasks
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
        <Card className="border-purple-100 dark:border-border hover:border-purple-200 dark:hover:border-purple-900/30 hover:shadow-md transition-all duration-300 rounded-2xl p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Tasks
            </CardTitle>
            <CardDescription>Manage your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">View, create, and organize your tasks to stay on top of your work.</p>
          </CardContent>
          <CardFooter>
            <Link to="/tasks" className="w-full">
              <Button variant="outline" className="w-full gap-2 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 border-purple-200 dark:border-purple-900/30">
                Go to Tasks
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="border-blue-100 dark:border-border hover:border-blue-200 dark:hover:border-blue-900/30 hover:shadow-md transition-all duration-300 rounded-2xl p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Time Tracking
            </CardTitle>
            <CardDescription>Track time on tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Monitor how much time you spend on each task to improve productivity.</p>
          </CardContent>
          <CardFooter>
            <Link to="/time-tracking" className="w-full">
              <Button variant="outline" className="w-full gap-2 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 border-blue-200 dark:border-blue-900/30">
                Go to Time Tracking
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="border-green-100 dark:border-border hover:border-green-200 dark:hover:border-green-900/30 hover:shadow-md transition-all duration-300 rounded-2xl p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-green-500 dark:text-green-400" />
              Reports
            </CardTitle>
            <CardDescription>Analyze your productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Get insights into your work patterns and task completion rates.</p>
          </CardContent>
          <CardFooter>
            <Link to="/reports" className="w-full">
              <Button variant="outline" className="w-full gap-2 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-300 border-green-200 dark:border-green-900/30">
                Go to Reports
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <Card className="border-purple-100 dark:border-border hover:shadow-md transition-all duration-300 rounded-2xl p-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              What to focus on next
            </CardTitle>
            <CardDescription>Based on priority</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedPendingTasks.length > 0 ? (
              <ul className="space-y-3">
                {sortedPendingTasks.map((task) => (
                  <li key={task.id} className="p-3 bg-purple-50/50 dark:bg-purple-900/10 rounded-md border border-purple-100 dark:border-purple-900/20 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusBadgeClass(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityBadgeClass(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No pending tasks</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/tasks" className="w-full">
              <Button variant="outline" className="w-full">View all tasks</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="border-green-100 dark:border-border hover:shadow-md transition-all duration-300 rounded-2xl p-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-green-500 dark:text-green-400" />
              Recently completed
            </CardTitle>
            <CardDescription>Great work!</CardDescription>
          </CardHeader>
          <CardContent>
            {recentlyCompletedTasks.length > 0 ? (
              <ul className="space-y-3">
                {recentlyCompletedTasks.map((task) => (
                  <li key={task.id} className="p-3 bg-green-50/50 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-900/20 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50">
                          completed
                        </Badge>
                        {task.timeLogged > 0 && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            {formatTime(task.timeLogged)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No completed tasks yet</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/tasks" className="w-full">
              <Button variant="outline" className="w-full">View all completed tasks</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
