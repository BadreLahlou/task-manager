
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TaskProps } from '@/types/task';
import { generateUUID } from '@/utils/taskUtils';

interface TaskCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreate: (task: TaskProps) => void;
}

export const TaskCreateDialog = ({
  open,
  onOpenChange,
  onTaskCreate
}: TaskCreateDialogProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
    }
  }, [open]);

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    const newTask: TaskProps = {
      id: generateUUID(),
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: newTaskDueDate || undefined,
      timeLogged: 0
    };

    onTaskCreate(newTask);
    toast.success("Task created successfully");
    onOpenChange(false); // Close dialog after task creation
  };

  const handleCancel = () => {
    console.log("Cancel clicked, closing dialog");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input 
              id="title" 
              placeholder="Enter task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)} 
              className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Enter task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={newTaskPriority} 
              onValueChange={(value) => setNewTaskPriority(value as 'low' | 'medium' | 'high')}
              defaultValue="medium"
            >
              <SelectTrigger id="priority" className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Input 
              id="dueDate" 
              type="text" 
              placeholder="e.g., Tomorrow, Friday, Next Week"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleCreateTask}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
