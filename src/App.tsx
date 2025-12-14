import { ThemeProvider } from '@/providers/theme-provider';
import { TodoApp } from '@/pages/TodoApp';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todoapp-theme">
      <TodoApp />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
