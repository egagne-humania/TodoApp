import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Convex React hooks
vi.mock('convex/react', () => ({
  useQuery: vi.fn(() => []), // Return empty array by default for todos
  useMutation: vi.fn(() => vi.fn()),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
  ConvexReactClient: vi.fn(),
}));

// Mock Convex generated API
vi.mock('../../convex/_generated/api', () => ({
  api: {
    todos: {
      list: 'todos:list',
      get: 'todos:get',
      create: 'todos:create',
      update: 'todos:update',
      toggleComplete: 'todos:toggleComplete',
      remove: 'todos:remove',
    },
  },
}));

// Mock Convex generated dataModel
vi.mock('../../convex/_generated/dataModel', () => ({
  Id: String,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
