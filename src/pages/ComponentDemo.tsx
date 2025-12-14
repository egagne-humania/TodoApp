import { useState } from 'react';
import { Moon, Sun, Palette, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/providers/theme-provider';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import type { Todo, CreateTodoInput } from '@/types/todo';

export function ComponentDemo() {
  const { theme, setTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([
    {
      _id: '1',
      title: 'Design new landing page',
      description: 'Create mockups and prototypes for the new marketing site',
      status: 'active',
      priority: 'high',
      dueDate: new Date('2025-12-15'),
      createdAt: new Date('2025-12-10'),
      updatedAt: new Date('2025-12-10'),
      userId: 'demo-user',
    },
    {
      _id: '2',
      title: 'Review pull requests',
      description: 'Check and merge pending PRs from the team',
      status: 'active',
      priority: 'medium',
      dueDate: new Date('2025-12-14'),
      createdAt: new Date('2025-12-11'),
      updatedAt: new Date('2025-12-11'),
      userId: 'demo-user',
    },
    {
      _id: '3',
      title: 'Update documentation',
      description: 'Add new API endpoints to the developer docs',
      status: 'completed',
      priority: 'low',
      createdAt: new Date('2025-12-09'),
      updatedAt: new Date('2025-12-12'),
      userId: 'demo-user',
    },
  ]);

  const handleToggleTheme = () => {
    // Cycle through: light → dark → system → light
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id
          ? {
              ...todo,
              status: todo.status === 'active' ? 'completed' : 'active',
              updatedAt: new Date(),
            }
          : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  const handleCreateTodo = (input: CreateTodoInput) => {
    const newTodo: Todo = {
      _id: Date.now().toString(),
      title: input.title,
      description: input.description,
      status: 'active',
      priority: input.priority || 'medium',
      dueDate: input.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'demo-user',
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header with Glass Effect */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">TodoApp</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Professional UI Components with Glass Morphism
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleTheme}
              className="tap-target bg-background/50 hover:bg-background/80"
              aria-label={`Toggle theme (current: ${theme})`}
              title={`Current: ${theme} - Click to cycle`}
            >
              {theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Background for Glass Effect Demo */}
      <section className="relative border-b overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Beautiful, Professional UI
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with React, TypeScript, Tailwind CSS v4, and Shadcn UI. Fully responsive,
              theme-aware, and following best practices.
            </p>
            
            {/* Glass Effect Demo Card */}
            <div className="inline-block">
              <Card className="glass-effect border border-border/50">
                <CardContent className="p-6">
                  <p className="text-sm text-foreground font-medium">
                    ✨ Glass Morphism Effect • Scroll to see the header blur
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 bg-background">
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-muted p-1">
            <TabsTrigger value="todo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="h-4 w-4 mr-2" />
              Todo
            </TabsTrigger>
            <TabsTrigger value="base" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="h-4 w-4 mr-2" />
              Base
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sparkles className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Todo Components Tab */}
          <TabsContent value="todo" className="space-y-8 mt-8">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Todo Components</CardTitle>
                <CardDescription>
                  Complete todo management system with form, list, and item components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Todo Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Create New Todo</h3>
                  <TodoForm onSubmit={handleCreateTodo} />
                </div>

                {/* Todo List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Todo List</h3>
                  <TodoList
                    todos={todos}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Base Components Tab */}
          <TabsContent value="base" className="space-y-8 mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Various button styles and variants</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link" className="text-primary">Link</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Theme color palette</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-primary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Primary</p>
                      <p className="text-sm text-muted-foreground">Main brand color</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-secondary shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Secondary</p>
                      <p className="text-sm text-muted-foreground">Supporting color</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-destructive shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Destructive</p>
                      <p className="text-sm text-muted-foreground">Danger actions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-8 mt-8">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>
                  Responsive design, animations, and theme system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Theme Switching</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the theme toggle in the header to switch between light and dark modes.
                    The preference is saved in localStorage.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Responsive Design</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    All components are optimized for mobile, tablet, and desktop. Try resizing
                    your browser window.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Accessibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Touch-friendly targets (44px minimum), keyboard navigation, ARIA labels, and
                    semantic HTML throughout.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with ❤️ using React, TypeScript, Tailwind CSS & Shadcn UI
          </p>
        </div>
      </footer>
    </div>
  );
}
