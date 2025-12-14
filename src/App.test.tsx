import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as convexReact from 'convex/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.mocked(convexReact.useQuery).mockReturnValue([]);
    vi.mocked(convexReact.useMutation).mockReturnValue(vi.fn());
  });

  it('should render the TodoApp', () => {
    render(<App />);
    expect(screen.getByText(/TodoApp/i)).toBeInTheDocument();
  });

  it('should render with system theme by default', () => {
    render(<App />);
    expect(screen.getByText(/Manage your tasks efficiently/i)).toBeInTheDocument();
  });
});
