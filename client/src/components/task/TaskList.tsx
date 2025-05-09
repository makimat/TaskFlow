import { Task, TaskFilterType, User } from '@/types';
import TaskCard from './TaskCard';
import EmptyState from '@/components/EmptyState';

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilterType;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
  teamMembers: User[];
  isLoading: boolean;
  onNewTask: () => void;
}

export default function TaskList({
  tasks,
  filter,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  teamMembers,
  isLoading,
  onNewTask
}: TaskListProps) {
  // Filter tasks based on current filter
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);
  
  // Add team member data to tasks
  const enhancedTasks = filteredTasks.map(task => {
    const assignee = teamMembers.find(member => member.id === task.assignedToId);
    return {
      ...task,
      assignee
    };
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-48 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                <div className="h-3 bg-gray-200 rounded w-16 ml-2"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (enhancedTasks.length === 0) {
    return (
      <EmptyState 
        message={`No ${filter !== 'all' ? filter : ''} tasks found`}
        description="Create a new task to get started"
        onNewTask={onNewTask}
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {enhancedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
        />
      ))}
    </div>
  );
}
