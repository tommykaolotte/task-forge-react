
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TodoProvider, useTodos } from '../contexts/TodoContext';
import { Dashboard } from '../components/Dashboard';
import { TodoList } from '../components/TodoList';
import { KanbanBoard } from '../components/KanbanBoard';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { TodoForm } from '../components/TodoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ViewMode } from '../types/todo';

const TodoApp: React.FC = () => {
  const {
    viewMode,
    fetchTodos,
    createTodo,
    updateTodo
  } = useTodos();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreateTodo = async (todoData: any) => {
    await createTodo(todoData);
    setShowCreateDialog(false);
  };

  const handleUpdateTodo = async (todoData: any) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return <TodoList onEdit={setEditingTodo} />;
      case 'kanban':
        return <KanbanBoard onEdit={setEditingTodo} />;
      case 'calendar':
        return <div className="p-6 text-center">Calendar view coming soon...</div>;
      default:
        return <Dashboard onCreateTodo={() => setShowCreateDialog(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex h-screen">
        <Sidebar onCreateTodo={() => setShowCreateDialog(true)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onCreateTodo={() => setShowCreateDialog(true)} />
          
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Todo</DialogTitle>
          </DialogHeader>
          <TodoForm
            onSubmit={handleCreateTodo}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <TodoForm
            todo={editingTodo}
            onSubmit={handleUpdateTodo}
            onCancel={() => setEditingTodo(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <TodoProvider>
        <TodoApp />
      </TodoProvider>
    </ThemeProvider>
  );
};

export default Index;
