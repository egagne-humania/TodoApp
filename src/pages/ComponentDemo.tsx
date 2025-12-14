import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TodoItem } from '@/components/TodoItem';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { useTheme } from '@/providers/theme-provider';
import type { Todo } from '@/types/todo';

/**
 * ComponentDemo - Demo page showcasing all UI components
 * Shows functionality and styling of Shadcn components and custom Todo components
 */
export function ComponentDemo() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const mockTodos: Todo[] = [
    {
      _id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive docs for the project',
      status: 'active',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
      userId: 'user1',
    },
    {
      _id: '2',
      title: 'Review pull requests',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date('2024-12-02'),
      updatedAt: new Date('2024-12-02'),
      userId: 'user1',
    },
    {
      _id: '3',
      title: 'Fix bug in authentication',
      description: 'Users unable to login with Microsoft accounts',
      status: 'active',
      priority: 'high',
      createdAt: new Date('2024-12-03'),
      updatedAt: new Date('2024-12-03'),
      userId: 'user1',
    },
  ];

  const handleToggleTodo = (id: string) => {
    console.log('Toggle todo:', id);
  };

  const handleDeleteTodo = (id: string) => {
    console.log('Delete todo:', id);
  };

  const handleCreateTodo = (todo: unknown) => {
    console.log('Create todo:', todo);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Component Demo</h1>
            <p className="text-muted-foreground mt-2">
              Showcase of Shadcn UI components and custom Todo components
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Separator />

        {/* Tabs for organized demo sections */}
        <Tabs defaultValue="base" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="base">Base Components</TabsTrigger>
            <TabsTrigger value="todo">Todo Components</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Base Components Tab */}
          <TabsContent value="base" className="space-y-6 mt-6">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Different button variants and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </CardContent>
            </Card>

            {/* Inputs & Forms */}
            <Card>
              <CardHeader>
                <CardTitle>Inputs & Forms</CardTitle>
                <CardDescription>
                  Form inputs with labels and validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Email</Label>
                  <Input
                    id="demo-input"
                    type="email"
                    placeholder="Enter your email..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="demo-checkbox"
                    checked={checked}
                    onCheckedChange={(checked) =>
                      setChecked(checked as boolean)
                    }
                  />
                  <Label htmlFor="demo-checkbox">Accept terms and conditions</Label>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status and priority indicators</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>

            {/* Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton Loaders</CardTitle>
                <CardDescription>Loading states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Todo Components Tab */}
          <TabsContent value="todo" className="space-y-6 mt-6">
            {/* TodoForm */}
            <TodoForm onSubmit={handleCreateTodo} />

            <Separator />

            {/* TodoItem */}
            <Card>
              <CardHeader>
                <CardTitle>TodoItem Component</CardTitle>
                <CardDescription>
                  Single todo item with actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TodoItem
                  todo={mockTodos[0]}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              </CardContent>
            </Card>

            {/* TodoList */}
            <Card>
              <CardHeader>
                <CardTitle>TodoList Component</CardTitle>
                <CardDescription>List of todos</CardDescription>
              </CardHeader>
              <CardContent>
                <TodoList
                  todos={mockTodos}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              </CardContent>
            </Card>

            {/* TodoList Loading */}
            <Card>
              <CardHeader>
                <CardTitle>TodoList Loading State</CardTitle>
                <CardDescription>Skeleton loader for todos</CardDescription>
              </CardHeader>
              <CardContent>
                <TodoList
                  todos={[]}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  isLoading={true}
                />
              </CardContent>
            </Card>

            {/* TodoList Empty */}
            <Card>
              <CardHeader>
                <CardTitle>TodoList Empty State</CardTitle>
                <CardDescription>When no todos exist</CardDescription>
              </CardHeader>
              <CardContent>
                <TodoList
                  todos={[]}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Components Tab */}
          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* Dialog */}
            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>Modal dialogs</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setDialogOpen(false)}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Dropdown Menu */}
            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menu</CardTitle>
                <CardDescription>Context menus and dropdowns</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card content goes here.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                  <CardDescription>With some content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    More card content here.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Third Card</CardTitle>
                  <CardDescription>Last example</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Final card content.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
