/**
 * Todo domain types
 */

export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoStatus = 'active' | 'completed';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';
