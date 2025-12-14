import { TodoItem } from './TodoItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ListTodo } from 'lucide-react';
import type { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

/**
 * TodoList - Presentational component for displaying a list of todos
 * Follows SOLID principles (Single Responsibility, Open/Closed)
 * Optimized for mobile-first responsive design
 */
export function TodoList({
  todos,
  onToggle,
  onDelete,
  isLoading = false,
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <Skeleton className="h-5 w-5 rounded shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
          <div className="rounded-full bg-muted p-4 mb-4">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">No todos yet</h3>
          <p className="text-muted-foreground text-center text-sm sm:text-base max-w-sm">
            Create your first todo to get started on your tasks!
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeTodos = todos.filter((todo) => todo.status === 'active');
  const completedTodos = todos.filter((todo) => todo.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>
          {activeTodos.length} active, {completedTodos.length} completed
        </span>
        <span className="font-medium">{todos.length} total</span>
      </div>

      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm font-semibold text-foreground px-1 flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Active Tasks
          </h3>
          {activeTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed Tasks
          </h3>
          <div className="space-y-3 sm:space-y-4 opacity-75">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
