import { ThemeProvider } from '@/providers/theme-provider';
import { ComponentDemo } from '@/pages/ComponentDemo';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todoapp-theme">
      <ComponentDemo />
    </ThemeProvider>
  );
}

export default App;
