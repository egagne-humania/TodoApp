import { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
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
 */
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const handleToggle = useCallback(() => {
    onToggle(todo._id);
  }, [todo._id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(todo._id);
  }, [todo._id, onDelete]);

  const priorityVariant = {
    low: 'secondary',
    medium: 'secondary',
    high: 'destructive',
  } as const;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="flex items-start gap-4 p-4">
        <Checkbox
          checked={todo.status === 'completed'}
          onCheckedChange={handleToggle}
          aria-label={`Mark "${todo.title}" as ${
            todo.status === 'completed' ? 'active' : 'completed'
          }`}
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-base font-semibold ${
                todo.status === 'completed'
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground'
              }`}
            >
              {todo.title}
            </h3>
            <Badge variant={priorityVariant[todo.priority]}>
              {todo.priority}
            </Badge>
          </div>
          {todo.description && (
            <p className="text-sm text-muted-foreground">{todo.description}</p>
          )}
          {todo.dueDate && (
            <p className="text-xs text-muted-foreground">
              Due: {formatDate(todo.dueDate)}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete "${todo.title}"`}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
