export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  createdById: number;
  assignedToId: number;
  // Virtual fields populated on the client
  assignee?: User;
  creator?: User;
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  assignedToId: number;
}

export type TaskFilterType = 'all' | 'pending' | 'in-progress' | 'completed';
