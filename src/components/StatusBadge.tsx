
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TodoStatus } from '../types/todo';

interface StatusBadgeProps {
  status: TodoStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  },
  in_progress: {
    label: 'In Progress',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  completed: {
    label: 'Completed',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
};
