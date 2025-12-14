import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the app', () => {
    render(<App />);
    expect(screen.getByText(/TodoApp/i)).toBeInTheDocument();
  });

  it('should render ComponentDemo page', () => {
    render(<App />);
    expect(
      screen.getByText(/professional ui components/i)
    ).toBeInTheDocument();
  });
});
