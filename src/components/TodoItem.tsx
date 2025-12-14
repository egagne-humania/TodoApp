import { useCallback } from 'react';
import { Trash2, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoItem - Presentational component for displaying a single todo item
 * Follows SOLID principles (Single Responsibility)
 * Optimized for mobile and desktop with touch-friendly targets
 */
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const handleToggle = useCallback(() => {
    onToggle(todo._id);
  }, [todo._id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(todo._id);
  }, [todo._id, onDelete]);

  const priorityStyles = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
  } as const;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days <= 7) return `Due in ${days} days`;
    return formatDate(date);
  };

  const isDueSoon = todo.dueDate && new Date(todo.dueDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <Card className="group transition-smooth hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
        {/* Checkbox - Touch-friendly on mobile */}
        <div className="tap-target flex items-center justify-center">
          <Checkbox
            checked={todo.status === 'completed'}
            onCheckedChange={handleToggle}
            aria-label={`Mark "${todo.title}" as ${
              todo.status === 'completed' ? 'active' : 'completed'
            }`}
            className="h-5 w-5 sm:h-4 sm:w-4"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and Priority */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3
              className={`text-base sm:text-lg font-semibold transition-smooth ${
                todo.status === 'completed'
                  ? 'text-muted-foreground line-through opacity-60'
                  : 'text-foreground'
              }`}
            >
              {todo.title}
            </h3>
            <Badge 
              className={`${priorityStyles[todo.priority]} w-fit text-xs font-medium px-2.5 py-0.5`}
            >
              {todo.priority}
            </Badge>
          </div>

          {/* Description */}
          {todo.description && (
            <p className={`text-sm leading-relaxed transition-smooth ${
              todo.status === 'completed'
                ? 'text-muted-foreground/60 line-through'
                : 'text-muted-foreground'
            }`}>
              {todo.description}
            </p>
          )}

          {/* Metadata - Due Date */}
          {todo.dueDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className={`text-xs font-medium ${
                isOverdue 
                  ? 'text-destructive' 
                  : isDueSoon 
                    ? 'text-warning' 
                    : 'text-muted-foreground'
              }`}>
                {formatRelativeTime(todo.dueDate)}
              </span>
            </div>
          )}

          {/* Created time - subtle metadata */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-smooth">
            <Clock className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-xs text-muted-foreground/60">
              Created {formatDate(todo.createdAt)}
            </span>
          </div>
        </div>

        {/* Delete Button - Touch-friendly on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete "${todo.title}"`}
          className="tap-target shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth opacity-0 group-hover:opacity-100 sm:opacity-100"
        >
          <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
