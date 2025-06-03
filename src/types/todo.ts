
export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';
export type ViewMode = 'list' | 'kanban' | 'calendar';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  due_date?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  due_date?: string;
  tags?: string[];
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  due_date?: string;
  tags?: string[];
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface TodoStats {
  total_todos: number;
  completed_todos: number;
  pending_todos: number;
  in_progress_todos: number;
  overdue_todos: number;
  high_priority_todos: number;
  completion_rate: number;
  todos_by_priority: Record<string, number>;
  todos_by_status: Record<string, number>;
  todos_by_tag: Record<string, number>;
  overdue_by_priority: Record<string, number>;
}

export interface FilterParams {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  tag?: string;
  due_before?: string;
  due_after?: string;
  page?: number;
  size?: number;
}
