import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  it('should render form with title input', () => {
    render(<TodoForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('should render form with description input', () => {
    render(<TodoForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should render form with priority select', () => {
    render(<TodoForm onSubmit={vi.fn()} />);
    expect(screen.getByText(/priority level/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<TodoForm onSubmit={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /create todo/i })
    ).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Todo');

    const submitButton = screen.getByRole('button', { name: /create todo/i });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Todo',
      })
    );
  });

  it('should include description in submission when provided', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'New Todo');
    await user.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /create todo/i });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Todo',
        description: 'Test Description',
      })
    );
  });

  it('should clear form after successful submission', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    await user.type(titleInput, 'New Todo');

    const submitButton = screen.getByRole('button', { name: /create todo/i });
    await user.click(submitButton);

    expect(titleInput.value).toBe('');
  });

  it('should not submit when title is empty', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create todo/i });
    await user.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should disable submit button when submitting', async () => {
    const onSubmit = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const user = userEvent.setup();

    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Todo');

    const submitButton = screen.getByRole('button', {
      name: /create todo/i,
    }) as HTMLButtonElement;
    await user.click(submitButton);

    expect(submitButton.disabled).toBe(true);
  });
});
