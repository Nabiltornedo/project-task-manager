// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Project types
export interface Project {
  id: number;
  title: string;
  description: string | null;
  ownerName: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  title: string;
  description?: string;
}

export interface ProjectProgress {
  projectId: number;
  projectTitle: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progressPercentage: number;
  status: string;
}

// Task types
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
  priority: TaskPriority;
  overdue: boolean;
  projectId: number;
  projectTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
}

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}
