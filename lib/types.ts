export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface Collaborator {
  userId: string;
  role: 'viewer' | 'editor';
  _id: string;
}

export interface TodoApp {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: Collaborator[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoAppPayload {
  name: string;
  description: string;
}

export interface UpdateTodoAppPayload {
  name?: string;
  description?: string;
}

export interface CollaboratorPayload {
  email: string;
  role: 'viewer' | 'editor';
}

export type TaskStatus = 'stale' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  todoAppId: string;
  createdBy: string;
  dueDate?: string;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  todoAppId: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}