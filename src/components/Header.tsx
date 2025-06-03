import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sun, Moon, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTheme } from '../contexts/ThemeContext';
import { useTodos } from '../contexts/TodoContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onCreateTodo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateTodo }) => {
  const { theme, toggleTheme } = useTheme();
  const { viewMode } = useTodos();

  const getViewTitle = () => {
    switch (viewMode) {
      case 'list':
        return 'List View';
      case 'kanban':
        return 'Kanban Board';
      case 'calendar':
        return 'Calendar View';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getViewTitle()}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage and organize your tasks
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search todos..."
              className="pl-10 w-64"
            />
          </div>

          <Link to="/api-test">
            <Button
              variant="outline"
              size="sm"
              className="p-2"
              title="Test API Connection"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <Button
            onClick={onCreateTodo}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Todo
          </Button>
        </div>
      </div>
    </header>
  );
};
