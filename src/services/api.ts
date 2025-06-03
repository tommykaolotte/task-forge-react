import axios from 'axios';
import { Todo, TodoCreate, TodoUpdate, TodoListResponse, TodoStats, FilterParams } from '../types/todo';
import { API_CONFIG, API_INTERCEPTORS } from '../config/api';

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add request interceptors
api.interceptors.request.use(
  API_INTERCEPTORS.request.addAuth,
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  API_INTERCEPTORS.request.logRequest,
  (error) => Promise.reject(error)
);

// Add response interceptors
api.interceptors.response.use(
  API_INTERCEPTORS.response.logResponse,
  API_INTERCEPTORS.response.handleErrors
);

export const todoApi = {
  // Health check endpoint
  healthCheck: async (): Promise<any> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  },

  // Get todos with filters
  getTodos: async (params: FilterParams = {}): Promise<TodoListResponse> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TODOS, { params });
    return response.data;
  },

  // Get single todo
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TODO_BY_ID(id));
    return response.data;
  },

  // Create todo
  createTodo: async (todo: TodoCreate): Promise<Todo> => {
    const response = await api.post(API_CONFIG.ENDPOINTS.TODOS, todo);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: string, todo: TodoUpdate): Promise<Todo> => {
    const response = await api.put(API_CONFIG.ENDPOINTS.TODO_BY_ID(id), todo);
    return response.data;
  },

  // Update todo status only
  updateTodoStatus: async (id: string, status: string): Promise<Todo> => {
    const response = await api.patch(API_CONFIG.ENDPOINTS.TODO_STATUS(id), { status });
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(API_CONFIG.ENDPOINTS.TODO_BY_ID(id));
  },

  // Get todo statistics
  getStats: async (start_date?: string, end_date?: string): Promise<TodoStats> => {
    const params = { start_date, end_date };
    const response = await api.get(API_CONFIG.ENDPOINTS.TODO_STATS, { params });
    return response.data;
  },

  // Bulk operations
  bulkUpdate: async (updates: Record<string, TodoUpdate>): Promise<Todo[]> => {
    const response = await api.put(API_CONFIG.ENDPOINTS.TODO_BULK, { updates });
    return response.data;
  },

  bulkCreate: async (todos: TodoCreate[]): Promise<Todo[]> => {
    const response = await api.post(API_CONFIG.ENDPOINTS.TODO_BULK, { todos });
    return response.data;
  },

  // Search todos
  searchTodos: async (query: string, filters: Partial<FilterParams> = {}): Promise<TodoListResponse> => {
    const response = await api.post(API_CONFIG.ENDPOINTS.TODO_SEARCH, {
      query,
      ...filters
    }, {
      params: { page: filters.page || 1, size: filters.size || 10 }
    });
    return response.data;
  }
};

// Export the configured axios instance for direct use if needed
export { api };

// Export API configuration for use in components
export { API_CONFIG };
