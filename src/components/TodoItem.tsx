
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { Todo } from '../types/todo';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { useTodos } from '../contexts/TodoContext';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  compact?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, compact = false }) => {
  const { deleteTodo, updateTodo } = useTodos();

  const handleStatusChange = async () => {
    const nextStatus = todo.status === 'pending' 
      ? 'in_progress' 
      : todo.status === 'in_progress' 
      ? 'completed' 
      : 'pending';
    
    await updateTodo(todo.id, { status: nextStatus });
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
  };

  if (compact) {
    return (
      <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">{todo.title}</h3>
          <div className="flex items-center space-x-1">
            <PriorityIndicator priority={todo.priority} size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(todo)}
              className="h-6 w-6 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <StatusBadge status={todo.status} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{todo.title}</h3>
            <StatusBadge status={todo.status} />
            <PriorityIndicator priority={todo.priority} />
          </div>
          
          {todo.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">{todo.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {todo.due_date && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(todo.due_date).toLocaleDateString()}</span>
              </div>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex space-x-1">
                {todo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusChange}
          >
            {todo.status === 'pending' && 'Start'}
            {todo.status === 'in_progress' && 'Complete'}
            {todo.status === 'completed' && 'Reopen'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(todo)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
