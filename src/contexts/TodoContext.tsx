import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Todo, TodoCreate, TodoUpdate, FilterParams, ViewMode } from '../types/todo';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import { toast } from 'sonner';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filters: FilterParams;
  viewMode: ViewMode;
  selectedTodos: string[];
  pagination: {
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
  initialized: boolean;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TODOS'; payload: { todos: Todo[]; pagination: any } }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: FilterParams }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SELECTED_TODOS'; payload: string[] }
  | { type: 'TOGGLE_TODO_SELECTION'; payload: string }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  filters: { page: 1, size: 10 },
  viewMode: 'list',
  selectedTodos: [],
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    total_pages: 0
  },
  initialized: false
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload.todos,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        pagination: { ...state.pagination, total: state.pagination.total + 1 }
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        pagination: { ...state.pagination, total: state.pagination.total - 1 }
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SELECTED_TODOS':
      return { ...state, selectedTodos: action.payload };
    case 'TOGGLE_TODO_SELECTION':
      const isSelected = state.selectedTodos.includes(action.payload);
      return {
        ...state,
        selectedTodos: isSelected
          ? state.selectedTodos.filter(id => id !== action.payload)
          : [...state.selectedTodos, action.payload]
      };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    default:
      return state;
  }
};

interface TodoContextType extends TodoState {
  fetchTodos: () => Promise<void>;
  createTodo: (todo: TodoCreate) => Promise<void>;
  updateTodo: (id: string, todo: TodoUpdate) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  setFilters: (filters: FilterParams) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTodoSelection: (id: string) => void;
  setSelectedTodos: (ids: string[]) => void;
  bulkUpdateTodos: (status: string) => Promise<void>;
  bulkDeleteTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { user } = useAuth();

  // Stable fetchTodos function using Supabase
  const fetchTodos = useCallback(async (customFilters?: FilterParams) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const filtersToUse = customFilters || state.filters;
      
      let query = supabase
        .from('todos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filtersToUse.status) {
        query = query.eq('status', filtersToUse.status);
      }
      if (filtersToUse.priority) {
        query = query.eq('priority', filtersToUse.priority);
      }
      if (filtersToUse.search) {
        query = query.or(`title.ilike.%${filtersToUse.search}%,description.ilike.%${filtersToUse.search}%`);
      }
      if (filtersToUse.due_before) {
        query = query.lte('due_date', filtersToUse.due_before);
      }
      if (filtersToUse.due_after) {
        query = query.gte('due_date', filtersToUse.due_after);
      }

      // Apply pagination
      const page = filtersToUse.page || 1;
      const size = filtersToUse.size || 10;
      const from = (page - 1) * size;
      const to = from + size - 1;
      
      query = query.range(from, to);

      const { data: todos, error, count } = await query;

      if (error) {
        throw error;
      }

      const total = count || 0;
      const total_pages = Math.ceil(total / size);

      dispatch({
        type: 'SET_TODOS',
        payload: {
          todos: (todos || []).map(todo => ({
            ...todo,
            status: todo.status as any,
            priority: todo.priority as any
          })),
          pagination: {
            page,
            size,
            total,
            total_pages
          }
        }
      });
      
      if (!state.initialized) {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    } catch (error: any) {
      console.error('Failed to fetch todos:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch todos' });
      toast.error('Không thể tải danh sách công việc');
    }
  }, []); // No dependencies to avoid cycle

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    fetchTodos(state.filters);
  }, [state.filters.page, state.filters.size, state.filters.status, state.filters.priority, state.filters.search]);

  // Initial fetch on mount
  useEffect(() => {
    if (!state.initialized) {
      console.log('Initial todos fetch on component mount');
      fetchTodos();
    }
  }, [fetchTodos]);

  const createTodo = useCallback(async (todo: TodoCreate) => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để tạo công việc');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          ...todo,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      dispatch({ type: 'ADD_TODO', payload: { ...data, status: data.status as any, priority: data.priority as any } });
      toast.success('Tạo công việc thành công!');
    } catch (error: any) {
      console.error('Failed to create todo:', error);
      toast.error('Không thể tạo công việc');
    }
  }, [user]);

  const updateTodo = useCallback(async (id: string, todo: TodoUpdate) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(todo)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      dispatch({ type: 'UPDATE_TODO', payload: { ...data, status: data.status as any, priority: data.priority as any } });
      toast.success('Cập nhật công việc thành công!');
    } catch (error: any) {
      console.error('Failed to update todo:', error);
      toast.error('Không thể cập nhật công việc');
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      dispatch({ type: 'DELETE_TODO', payload: id });
      toast.success('Xóa công việc thành công!');
    } catch (error: any) {
      console.error('Failed to delete todo:', error);
      toast.error('Không thể xóa công việc');
    }
  }, []);

  const setFilters = useCallback((filters: FilterParams) => {
    console.log('Setting filters:', filters);
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const toggleTodoSelection = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO_SELECTION', payload: id });
  }, []);

  const setSelectedTodos = useCallback((ids: string[]) => {
    dispatch({ type: 'SET_SELECTED_TODOS', payload: ids });
  }, []);

  const bulkUpdateTodos = useCallback(async (status: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ status })
        .in('id', state.selectedTodos);

      if (error) throw error;
      
      await fetchTodos();
      setSelectedTodos([]);
      toast.success(`Cập nhật ${state.selectedTodos.length} công việc thành công!`);
    } catch (error: any) {
      console.error('Failed to bulk update todos:', error);
      toast.error('Không thể cập nhật hàng loạt công việc');
    }
  }, [state.selectedTodos, fetchTodos, setSelectedTodos]);

  const bulkDeleteTodos = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', state.selectedTodos);

      if (error) throw error;
      
      await fetchTodos();
      setSelectedTodos([]);
      toast.success(`Xóa ${state.selectedTodos.length} công việc thành công!`);
    } catch (error: any) {
      console.error('Failed to bulk delete todos:', error);
      toast.error('Không thể xóa hàng loạt công việc');
    }
  }, [state.selectedTodos, fetchTodos, setSelectedTodos]);

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        setFilters,
        setViewMode,
        toggleTodoSelection,
        setSelectedTodos,
        bulkUpdateTodos,
        bulkDeleteTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
