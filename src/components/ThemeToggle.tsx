import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";

/**
 * ThemeToggle - Cycles between light, dark, and system themes
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const cycleTheme = () => {
    // Cycle through: system -> light -> dark -> system
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };
  
  const getIcon = () => {
    if (theme === 'light') {
      return <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />;
    } else if (theme === 'dark') {
      return <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />;
    } else {
      return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />;
    }
  };
  
  const getLabel = () => {
    if (theme === 'light') return 'Light theme - Click for Dark';
    if (theme === 'dark') return 'Dark theme - Click for System';
    return 'System theme - Click for Light';
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
      <span className="sr-only">{getLabel()}</span>
    </Button>
  );
}
