import { formatDistanceToNow, format } from 'date-fns';
import { Task, TaskStatus } from '@/types';
import { 
  Edit, 
  Trash2,
  CheckCircle,
  RotateCcw,
  PlayCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange
}: TaskCardProps) {
  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case TaskStatus.PENDING:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-600',
          label: 'Pending'
        };
      case TaskStatus.IN_PROGRESS:
        return {
          variant: 'outline' as const,
          className: 'bg-amber-100 text-amber-800',
          label: 'In Progress'
        };
      case TaskStatus.COMPLETED:
        return {
          variant: 'outline' as const,
          className: 'bg-green-100 text-green-800',
          label: 'Completed'
        };
      default:
        return {
          variant: 'outline' as const,
          className: '',
          label: status
        };
    }
  };
  
  const statusBadge = getStatusBadgeProps(task.status);
  
  // Format created time
  const createdTime = task.createdAt 
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : '';
  
  // Format due date
  const dueDate = task.dueDate 
    ? format(new Date(task.dueDate), 'MMM d')
    : 'No due date';
  
  // Generate user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const assigneeInitials = task.assignee?.name ? getInitials(task.assignee.name) : '??';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-400 hover:text-red-600 ml-1"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{task.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {task.assignee?.picture ? (
              <img 
                src={task.assignee.picture} 
                alt={task.assignee.name} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                <span>{assigneeInitials}</span>
              </div>
            )}
            <span className="text-xs text-gray-500 ml-2">{task.assignee?.name}</span>
          </div>
          <span className="text-xs text-gray-500">Due: {dueDate}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {task.status === TaskStatus.COMPLETED 
              ? `Completed ${createdTime}`
              : `Created ${createdTime}`
            }
          </div>
          
          {task.status === TaskStatus.COMPLETED ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700"
              onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Mark Incomplete
            </Button>
          ) : task.status === TaskStatus.PENDING ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-xs font-medium text-amber-600 hover:text-amber-700"
              onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
            >
              <PlayCircle className="h-3.5 w-3.5 mr-1" />
              Start Task
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-xs font-medium text-primary hover:text-primary-hover"
              onClick={() => onStatusChange(TaskStatus.COMPLETED)}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
