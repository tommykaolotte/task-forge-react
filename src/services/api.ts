
import axios from 'axios';
import { Todo, TodoCreate, TodoUpdate, TodoListResponse, TodoStats, FilterParams } from '../types/todo';

const API_BASE_URL = 'http://finixai.mywire.org:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  // Get todos with filters
  getTodos: async (params: FilterParams = {}): Promise<TodoListResponse> => {
    const response = await api.get('/todos', { params });
    return response.data;
  },

  // Get single todo
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create todo
  createTodo: async (todo: TodoCreate): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: string, todo: TodoUpdate): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },

  // Update todo status only
  updateTodoStatus: async (id: string, status: string): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/status`, { status });
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Get todo statistics
  getStats: async (start_date?: string, end_date?: string): Promise<TodoStats> => {
    const params = { start_date, end_date };
    const response = await api.get('/todos/stats', { params });
    return response.data;
  },

  // Bulk operations
  bulkUpdate: async (updates: Record<string, TodoUpdate>): Promise<Todo[]> => {
    const response = await api.put('/todos/bulk', { updates });
    return response.data;
  },

  bulkCreate: async (todos: TodoCreate[]): Promise<Todo[]> => {
    const response = await api.post('/todos/bulk', { todos });
    return response.data;
  },

  // Search todos
  searchTodos: async (query: string, filters: Partial<FilterParams> = {}): Promise<TodoListResponse> => {
    const response = await api.post('/todos/search', {
      query,
      ...filters
    }, {
      params: { page: filters.page || 1, size: filters.size || 10 }
    });
    return response.data;
  }
};
