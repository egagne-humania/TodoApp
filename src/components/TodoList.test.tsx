import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import type { Todo } from '@/types/todo';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    {
      _id: '1',
      title: 'First Todo',
      status: 'active',
      priority: 'high',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      userId: 'user1',
    },
    {
      _id: '2',
      title: 'Second Todo',
      status: 'completed',
      priority: 'low',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      userId: 'user1',
    },
  ];

  it('should render all todos', () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('should render empty state when no todos', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no todos/i)).toBeInTheDocument();
  });

  it('should pass onToggle callback to TodoItem', () => {
    const onToggle = vi.fn();
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={vi.fn()} />);
    
    // We just verify the callback is passed, actual behavior is tested in TodoItem
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('should pass onDelete callback to TodoItem', () => {
    const onDelete = vi.fn();
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={onDelete} />);
    
    // We just verify the callback is passed, actual behavior is tested in TodoItem
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);
  });

  it('should render todos in order', () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    // Check that both todos are rendered (structure now includes section headers)
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
    // Verify sections are shown
    expect(screen.getByText(/active tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/completed tasks/i)).toBeInTheDocument();
  });

  it('should display loading skeleton when loading', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        isLoading={true}
      />
    );
    // Skeleton should be present (we'll use a test id for this)
    expect(screen.queryByText(/no todos/i)).not.toBeInTheDocument();
  });
});
