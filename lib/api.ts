import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  TodoApp,
  CreateTodoAppPayload,
  UpdateTodoAppPayload,
  CollaboratorPayload,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  UpdateTaskStatusPayload,
  User
} from './types';

const API_URL =process.env.NEST_PUBLIC_API_URL || "https://todo-app-production-8c59.up.railway.app/" ;
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const apiRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    throw new Error(error.message || 'An error occurred while making the request');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: (credentials: RegisterCredentials): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/register', 'POST', credentials),

  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/login', 'POST', credentials),

  logout: (): Promise<void> =>
    apiRequest<void>('/auth/logout', 'POST'),

  getProfile: (): Promise<User> =>
    apiRequest<User>('/api/users/profile'),

  getUserById: (userId: string): Promise<User> =>
    apiRequest<User>(`/users/${userId}`),
};

// TodoApp API
export const todoAppApi = {
  create: (todoApp: CreateTodoAppPayload): Promise<TodoApp> =>
    apiRequest<TodoApp>('/todo-apps', 'POST', todoApp),

  getAll: (): Promise<TodoApp[]> =>
    apiRequest<TodoApp[]>('/todo-apps'),

  getById: (id: string): Promise<TodoApp> =>
    apiRequest<TodoApp>(`/todo-apps/${id}`),


  update: (id: string, data: UpdateTodoAppPayload): Promise<TodoApp> =>
    apiRequest<TodoApp>(`/todo-apps/${id}`, 'PATCH', data),

  delete: (id: string): Promise<TodoApp> =>
    apiRequest<TodoApp>(`/todo-apps/${id}`, 'DELETE'),

  addCollaborator: (todoAppId: string, data: CollaboratorPayload): Promise<TodoApp> =>
    apiRequest<TodoApp>(`/todo-apps/${todoAppId}/collaborators`, 'POST', data),

  removeCollaborator: (todoAppId: string, collaboratorId: string): Promise<TodoApp> =>
    apiRequest<TodoApp>(`/todo-apps/${todoAppId}/collaborators/${collaboratorId}`, 'DELETE'),
};

// Task API
export const taskApi = {
  create: (task: CreateTaskPayload): Promise<Task> =>
    apiRequest<Task>('/tasks', 'POST', task),

  getAllByTodoApp: (todoAppId: string): Promise<Task[]> =>
    apiRequest<Task[]>(`/tasks?todoAppId=${todoAppId}`),

  getById: (id: string): Promise<Task> =>
    apiRequest<Task>(`/tasks/${id}`),

  update: (id: string, data: UpdateTaskPayload): Promise<Task> =>
    apiRequest<Task>(`/tasks/${id}`, 'PATCH', data),

  updateStatus: (id: string, data: UpdateTaskStatusPayload): Promise<Task> =>
    apiRequest<Task>(`/tasks/${id}/status`, 'PATCH', data),

  delete: (id: string): Promise<Task> =>
    apiRequest<Task>(`/tasks/${id}`, 'DELETE'),
};