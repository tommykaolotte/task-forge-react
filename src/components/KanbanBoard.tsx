
import React from 'react';
import { useTodos } from '../contexts/TodoContext';
import { TodoItem } from './TodoItem';
import { Todo, TodoStatus } from '../types/todo';

interface KanbanBoardProps {
  onEdit: (todo: Todo) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEdit }) => {
  const { todos, loading } = useTodos();

  const columns: { status: TodoStatus; title: string; color: string }[] = [
    { status: 'pending', title: 'Pending', color: 'bg-yellow-100 border-yellow-300' },
    { status: 'in_progress', title: 'In Progress', color: 'bg-blue-100 border-blue-300' },
    { status: 'completed', title: 'Completed', color: 'bg-green-100 border-green-300' }
  ];

  const getTodosByStatus = (status: TodoStatus) => {
    return todos.filter(todo => todo.status === status);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.status} className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <p className="text-gray-600 dark:text-gray-300">Drag and drop to organize your tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTodos = getTodosByStatus(column.status);
          
          return (
            <div key={column.status} className={`rounded-lg border-2 border-dashed p-4 ${column.color} dark:bg-gray-800 dark:border-gray-600`}>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                {column.title}
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {columnTodos.length}
                </span>
              </h3>
              
              <div className="space-y-3">
                {columnTodos.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                    No tasks
                  </p>
                ) : (
                  columnTodos.map((todo) => (
                    <div key={todo.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                      <TodoItem
                        todo={todo}
                        onEdit={onEdit}
                        compact
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
