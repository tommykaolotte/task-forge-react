// API Configuration for Finix AI Backend
export const API_CONFIG = {
  BASE_URL: 'http://finixai.mywire.org:8000',
  ENDPOINTS: {
    HEALTH: '/health',
    ROOT: '/',
    TODOS: '/todos',
    TODO_BY_ID: (id: string) => `/todos/${id}`,
    TODO_STATUS: (id: string) => `/todos/${id}/status`,
    TODO_SEARCH: '/todos/search',
    TODO_STATS: '/todos/stats',
    TODO_BULK: '/todos/bulk',
  },
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// API response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Request/Response interceptors configuration
export const API_INTERCEPTORS = {
  request: {
    // Add authorization headers if needed
    addAuth: (config: any) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    
    // Add request logging
    logRequest: (config: any) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    }
  },
  
  response: {
    // Handle common errors
    handleErrors: (error: any) => {
      if (error.response) {
        // Server responded with error status
        console.error(`[API Error] ${error.response.status}: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('[API Error] No response received from server');
      } else {
        // Something else happened
        console.error('[API Error]', error.message);
      }
      return Promise.reject(error);
    },
    
    // Log successful responses
    logResponse: (response: any) => {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
      return response;
    }
  }
}; 