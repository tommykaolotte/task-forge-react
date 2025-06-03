
import React from 'react';
import { useTodos } from '../contexts/TodoContext';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  onEdit: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ onEdit }) => {
  const { todos, loading } = useTodos();

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todo List</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your tasks</p>
      </div>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No todos found. Create your first todo!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};
