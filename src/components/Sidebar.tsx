
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, List, Calendar, Kanban } from 'lucide-react';
import { useTodos } from '../contexts/TodoContext';
import { ViewMode } from '../types/todo';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  onCreateTodo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateTodo }) => {
  const { viewMode, setViewMode } = useTodos();
  const { theme } = useTheme();

  const menuItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list' as ViewMode, label: 'List View', icon: List },
    { id: 'kanban' as ViewMode, label: 'Kanban Board', icon: Kanban },
    { id: 'calendar' as ViewMode, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Todo App</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage your tasks</p>
      </div>

      <div className="p-4">
        <Button
          onClick={onCreateTodo}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Todo
        </Button>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = viewMode === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Theme: {theme === 'dark' ? 'Dark' : 'Light'} Mode
        </div>
      </div>
    </div>
  );
};
