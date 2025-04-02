
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TaskProps } from '@/types/task';

interface StatusChartProps {
  tasks: TaskProps[];
}

const StatusChart = ({ tasks }: StatusChartProps) => {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  // Enhanced color scheme for status chart
  const statusData = [
    { name: 'To Do', value: todoTasks.length, color: '#FCD34D' },
    { name: 'In Progress', value: inProgressTasks.length, color: '#A78BFA' },
    { name: 'Completed', value: completedTasks.length, color: '#4ADE80' }
  ];

  // Filter out zero-value segments to avoid clutter
  const filteredData = statusData.filter(item => item.value > 0);
  
  // Custom label function to prevent overlapping
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // Don't show labels for small segments
    if (percent < 0.1) return null;
    
    const RADIAN = Math.PI / 180;
    // Calculate position to avoid overlapping
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.2;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.2;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#000" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData.length > 0 ? filteredData : [{name: 'No Data', value: 1, color: '#E5E7EB'}]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {(filteredData.length > 0 ? filteredData : [{name: 'No Data', value: 1, color: '#E5E7EB'}]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            layout="horizontal"
            formatter={(value) => <span className="text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;
