/**
 * TodoApp Main Page
 * 
 * Container component that manages the Todo application state and operations
 * using Convex for real-time backend integration.
 */

import { useCallback, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { Todo, TodoFilter, CreateTodoInput } from '@/types/todo';

/**
 * Convex todo document type
 */
interface ConvexTodo {
  _id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

/**
 * Convert Convex todo document to our Todo type
 */
function mapConvexTodo(convexTodo: ConvexTodo): Todo {
  return {
    _id: convexTodo._id,
    title: convexTodo.title,
    description: convexTodo.description,
    status: convexTodo.status,
    priority: convexTodo.priority,
    dueDate: convexTodo.dueDate ? new Date(convexTodo.dueDate) : undefined,
    createdAt: new Date(convexTodo.createdAt),
    updatedAt: new Date(convexTodo.updatedAt),
    userId: convexTodo.userId,
  };
}

export function TodoApp() {
  const [filter, setFilter] = useState<TodoFilter>('all');

  // Convex queries and mutations
  const convexTodos = useQuery(api.todos.list);
  const createTodo = useMutation(api.todos.create);
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const deleteTodo = useMutation(api.todos.remove);

  // Map Convex todos to our Todo type
  const allTodos = convexTodos ? convexTodos.map(mapConvexTodo) : undefined;

  // Filter todos based on current filter
  const filteredTodos = allTodos?.filter((todo) => {
    if (filter === 'active') return todo.status === 'active';
    if (filter === 'completed') return todo.status === 'completed';
    return true;
  });

  // Handle create todo
  const handleCreate = useCallback(async (todo: CreateTodoInput) => {
    try {
      await createTodo({
        title: todo.title,
        description: todo.description || undefined,
        priority: todo.priority || 'medium',
      });
      toast.success('Todo created successfully');
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo');
      throw error;
    }
  }, [createTodo]);

  // Handle toggle complete
  const handleToggle = useCallback(async (id: string) => {
    try {
      await toggleComplete({ id: id as never });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      toast.error('Failed to update todo');
      throw error;
    }
  }, [toggleComplete]);

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTodo({ id: id as never });
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo');
      throw error;
    }
  }, [deleteTodo]);

  // Calculate stats
  const totalCount = allTodos?.length || 0;
  const activeCount = allTodos?.filter(t => t.status === 'active').length || 0;
  const completedCount = allTodos?.filter(t => t.status === 'completed').length || 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold tracking-tight">TodoApp</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your tasks efficiently with real-time sync
            </p>
          </div>
          <ThemeToggle />
        </div>

        <TodoForm onSubmit={handleCreate} />

        <Card>
          <CardHeader>
            <CardTitle>Your Todos</CardTitle>
            <CardDescription>
              {totalCount === 0
                ? 'No todos yet. Create one above to get started!'
                : `${activeCount} active, ${completedCount} completed (${totalCount} total)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as TodoFilter)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All ({totalCount})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeCount})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="mt-6">
                <TodoList
                  todos={filteredTodos || []}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
