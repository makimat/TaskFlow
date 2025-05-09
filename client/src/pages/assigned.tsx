import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Task, TaskFilterType, TaskStatus, User } from '@/types';
import TaskList from '@/components/task/TaskList';
import TaskFilters from '@/components/task/TaskFilters';
import TaskForm from '@/components/task/TaskForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Header from '@/components/layout/Header';

export default function Assigned() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<TaskFilterType>('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  // Fetch tasks assigned to others
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['/api/tasks/assigned'],
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading: isLoadingTeam } = useQuery<User[]>({
    queryKey: ['/api/team'],
  });

  // Calculate task counts
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => task.status === TaskStatus.PENDING).length,
    'in-progress': tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
  };

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const response = await apiRequest('POST', '/api/tasks', taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/assigned'] });
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/tasks/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/assigned'] });
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/assigned'] });
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle opening the task form for a new task
  const handleNewTask = () => {
    setSelectedTask(undefined);
    setIsTaskFormOpen(true);
  };

  // Handle opening the task form for editing a task
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  // Handle saving a task (new or edited)
  const handleSaveTask = (data: any) => {
    // Format the data for the API
    const taskData = {
      ...data,
      // Convert the due date string to a proper date object if it exists
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
    };

    if (selectedTask) {
      // Update existing task
      updateTaskMutation.mutate({ id: selectedTask.id, data: taskData });
    } else {
      // Create new task with a different assignee
      createTaskMutation.mutate(taskData);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId: number) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  // Confirm task deletion
  const confirmDeleteTask = () => {
    if (taskToDelete !== null) {
      deleteTaskMutation.mutate(taskToDelete);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handle changing task status
  const handleStatusChange = (taskId: number, newStatus: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      data: { status: newStatus },
    });
  };

  // Check if data is still loading
  const isLoading = isLoadingTasks || isLoadingTeam;

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Override header title */}
      <Header title="Assigned to Others" onOpenSidebar={() => {}} user={user} />

      <TaskFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        onNewTask={handleNewTask}
        counts={taskCounts}
      />

      <TaskList
        tasks={tasks}
        filter={filter}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onStatusChange={handleStatusChange}
        teamMembers={teamMembers}
        isLoading={isLoading}
        onNewTask={handleNewTask}
      />

      {/* Task form dialog */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleSaveTask}
        teamMembers={teamMembers}
        currentUser={user}
        task={selectedTask}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTask}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
