
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Todo, TodoCreate, TodoUpdate, FilterParams, ViewMode } from '../types/todo';
import { todoApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

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
  | { type: 'TOGGLE_TODO_SELECTION'; payload: string };

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
  }
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
  const { toast } = useToast();

  const fetchTodos = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await todoApi.getTodos(state.filters);
      dispatch({
        type: 'SET_TODOS',
        payload: {
          todos: response.todos,
          pagination: {
            page: response.page,
            size: response.size,
            total: response.total,
            total_pages: response.total_pages
          }
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch todos' });
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive"
      });
    }
  }, [state.filters, toast]);

  const createTodo = useCallback(async (todo: TodoCreate) => {
    try {
      const newTodo = await todoApi.createTodo(todo);
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      toast({
        title: "Success",
        description: "Todo created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive"
      });
    }
  }, [toast]);

  const updateTodo = useCallback(async (id: string, todo: TodoUpdate) => {
    try {
      const updatedTodo = await todoApi.updateTodo(id, todo);
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
      toast({
        title: "Success",
        description: "Todo updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive"
      });
    }
  }, [toast]);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await todoApi.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
      toast({
        title: "Success",
        description: "Todo deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive"
      });
    }
  }, [toast]);

  const setFilters = useCallback((filters: FilterParams) => {
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
      const updates = state.selectedTodos.reduce((acc, id) => {
        acc[id] = { status: status as any };
        return acc;
      }, {} as Record<string, TodoUpdate>);
      
      await todoApi.bulkUpdate(updates);
      await fetchTodos();
      setSelectedTodos([]);
      toast({
        title: "Success",
        description: `Updated ${state.selectedTodos.length} todos`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todos",
        variant: "destructive"
      });
    }
  }, [state.selectedTodos, fetchTodos, setSelectedTodos, toast]);

  const bulkDeleteTodos = useCallback(async () => {
    try {
      await Promise.all(state.selectedTodos.map(id => todoApi.deleteTodo(id)));
      await fetchTodos();
      setSelectedTodos([]);
      toast({
        title: "Success",
        description: `Deleted ${state.selectedTodos.length} todos`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todos",
        variant: "destructive"
      });
    }
  }, [state.selectedTodos, fetchTodos, setSelectedTodos, toast]);

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
