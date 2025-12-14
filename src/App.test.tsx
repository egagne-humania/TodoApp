import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the app', () => {
    render(<App />);
    expect(screen.getByText(/component demo/i)).toBeInTheDocument();
  });

  it('should render ComponentDemo page', () => {
    render(<App />);
    expect(
      screen.getByText(/showcase of shadcn ui components/i)
    ).toBeInTheDocument();
  });
});
