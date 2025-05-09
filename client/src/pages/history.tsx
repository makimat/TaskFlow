import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task, TaskFilterType, User } from '@/types';
import TaskList from '@/components/task/TaskList';
import TaskFilters from '@/components/task/TaskFilters';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';

export default function History() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<TaskFilterType>('all');

  // Fetch completed tasks
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['/api/tasks/history'],
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading: isLoadingTeam } = useQuery<User[]>({
    queryKey: ['/api/team'],
  });

  // For history page, all tasks are completed, so we set task counts accordingly
  const taskCounts = {
    all: tasks.length,
    pending: 0,
    'in-progress': 0,
    completed: tasks.length,
  };

  // These handlers are empty since we don't allow editing or deleting from history
  const handleEditTask = () => {};
  const handleDeleteTask = () => {};
  const handleStatusChange = () => {};
  const handleNewTask = () => {};

  // Check if data is still loading
  const isLoading = isLoadingTasks || isLoadingTeam;

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Override header title */}
      <Header title="Task History" onOpenSidebar={() => {}} user={user} />

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
    </>
  );
}
