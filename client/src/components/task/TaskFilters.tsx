import { TaskFilterType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskFiltersProps {
  activeFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  onNewTask: () => void;
  counts: {
    all: number;
    pending: number;
    'in-progress': number;
    completed: number;
  };
}

export default function TaskFilters({ 
  activeFilter, 
  onFilterChange, 
  onNewTask,
  counts
}: TaskFiltersProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2 md:pb-0">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => onFilterChange('all')}
          className="flex items-center"
        >
          <span className="mr-1">All</span>
          <Badge variant="secondary" className="ml-1">{counts.all}</Badge>
        </Button>
        
        <Button
          variant={activeFilter === 'in-progress' ? 'default' : 'outline'}
          onClick={() => onFilterChange('in-progress')}
          className="flex items-center"
        >
          <span className="mr-1">In Progress</span>
          <Badge variant="secondary" className="ml-1">{counts['in-progress']}</Badge>
        </Button>
        
        <Button
          variant={activeFilter === 'completed' ? 'default' : 'outline'}
          onClick={() => onFilterChange('completed')}
          className="flex items-center"
        >
          <span className="mr-1">Completed</span>
          <Badge variant="secondary" className="ml-1">{counts.completed}</Badge>
        </Button>
        
        <Button
          variant={activeFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => onFilterChange('pending')}
          className="flex items-center"
        >
          <span className="mr-1">Pending</span>
          <Badge variant="secondary" className="ml-1">{counts.pending}</Badge>
        </Button>
      </div>
      
      {/* Create new task button */}
      <Button onClick={onNewTask} className="flex items-center">
        <Plus size={16} className="mr-1" />
        New Task
      </Button>
    </div>
  );
}
