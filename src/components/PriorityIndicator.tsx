
import React from 'react';
import { TodoPriority } from '../types/todo';
import { cn } from '@/lib/utils';

interface PriorityIndicatorProps {
  priority: TodoPriority;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const priorityConfig = {
  low: {
    label: 'Low',
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-400'
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-400'
  },
  high: {
    label: 'High',
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400'
  }
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ 
  priority, 
  className, 
  size = 'md' 
}) => {
  const config = priorityConfig[priority];
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div 
        className={cn(
          'rounded-full',
          config.color,
          sizeConfig[size]
        )}
        title={`${config.label} Priority`}
      />
      <span className={cn('text-sm font-medium', config.textColor)}>
        {config.label}
      </span>
    </div>
  );
};
