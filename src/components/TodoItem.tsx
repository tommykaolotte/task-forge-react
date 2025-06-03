
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Calendar, Tag } from 'lucide-react';
import { Todo } from '../types/todo';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: string) => void;
  className?: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected = false,
  onToggleSelect,
  onEdit,
  onDelete,
  onStatusChange,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && todo.status !== 'completed';

  const handleStatusChange = (status: string) => {
    onStatusChange?.(status);
  };

  return (
    <Card 
      className={`
        transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isOverdue ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' : ''}
        ${className || ''}
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="mt-1"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 
                className={`font-medium text-lg ${todo.status === 'completed' ? 'line-through text-gray-500' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {todo.title}
              </h3>
              
              <div className="flex items-center gap-2">
                <StatusBadge status={todo.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <PriorityIndicator priority={todo.priority} size="sm" />
              
              {todo.due_date && (
                <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4" />
                  {format(new Date(todo.due_date), 'MMM dd, yyyy HH:mm')}
                  {isOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
                </div>
              )}
            </div>

            {todo.description && (isExpanded || todo.description.length < 100) && (
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {isExpanded ? todo.description : `${todo.description.slice(0, 100)}${todo.description.length > 100 ? '...' : ''}`}
              </p>
            )}

            {todo.description && todo.description.length > 100 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-blue-600"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {todo.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-2">
              Created: {format(new Date(todo.created_at), 'MMM dd, yyyy')}
              {todo.updated_at !== todo.created_at && (
                <span> • Updated: {format(new Date(todo.updated_at), 'MMM dd, yyyy')}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
