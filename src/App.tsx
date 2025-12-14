import { ThemeProvider } from '@/providers/theme-provider';
import { ComponentDemo } from '@/pages/ComponentDemo';
import { StyleTest } from '@/pages/StyleTest';

function App() {
  // Toggle between StyleTest and ComponentDemo for debugging
  const showTest = new URLSearchParams(window.location.search).get('test') === 'true';
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="todoapp-theme">
      {showTest ? <StyleTest /> : <ComponentDemo />}
    </ThemeProvider>
  );
}

export default App;
