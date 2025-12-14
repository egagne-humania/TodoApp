import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { Todo } from '@/types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    status: 'active',
    priority: 'medium',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userId: 'user1',
  };

  it('should render todo title', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render todo description when provided', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };
    render(
      <TodoItem
        todo={todoWithoutDescription}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should display priority badge', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('should call onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should show checkbox as checked when status is completed', () => {
    const completedTodo = { ...mockTodo, status: 'completed' as const };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should show checkbox as unchecked when status is active', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should display due date when provided', () => {
    const todoWithDueDate = {
      ...mockTodo,
      dueDate: new Date('2024-12-31'),
    };
    render(
      <TodoItem
        todo={todoWithDueDate}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText(/due:/i)).toBeInTheDocument();
  });

  it('should apply different styling for different priorities', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const badge = screen.getByText('medium');
    expect(badge).toHaveClass('bg-secondary');
  });
});
