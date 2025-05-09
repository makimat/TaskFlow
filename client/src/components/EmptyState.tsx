import { Button } from '@/components/ui/button';
import { ClipboardCheck, Plus } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description: string;
  onNewTask: () => void;
}

export default function EmptyState({ message, description, onNewTask }: EmptyStateProps) {
  return (
    <div className="col-span-full">
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center bg-gray-100 rounded-full">
          <ClipboardCheck className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">{message}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Button 
          onClick={onNewTask}
          className="flex items-center justify-center mx-auto"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Your First Task
        </Button>
      </div>
    </div>
  );
}
