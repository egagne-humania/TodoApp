import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders Vite + React heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /vite \+ react/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders count button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is 0/i });
    expect(button).toBeInTheDocument();
  });
});
