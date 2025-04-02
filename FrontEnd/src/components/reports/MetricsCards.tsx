
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskProps } from '@/types/task';

interface MetricsCardsProps {
  tasks: TaskProps[];
  formatTime: (seconds?: number) => string;
}

const MetricsCards = ({ tasks, formatTime }: MetricsCardsProps) => {
  const totalTimeLogged = tasks.reduce((total, task) => total + (task.timeLogged || 0), 0);
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <Card className="border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{tasks.length}</div>
        </CardContent>
      </Card>
      
      <Card className="border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-600">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-green-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">Total Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{formatTime(totalTimeLogged)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
