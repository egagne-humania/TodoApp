import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { CreateTodoInput, TodoPriority } from '@/types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoInput) => void | Promise<void>;
}

/**
 * TodoForm - Component for creating new todos
 * Follows SOLID principles (Single Responsibility)
 * Optimized for mobile and desktop with clear visual hierarchy
 */
export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
        });

        // Clear form on success
        setTitle('');
        setDescription('');
        setPriority('medium');
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, description, priority, onSubmit]
  );

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-success' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning' },
    { value: 'high', label: 'High Priority', color: 'text-destructive' },
  ];

  return (
    <Card className="card-elevated">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
          <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          Create New Todo
        </CardTitle>
        <CardDescription className="text-sm">
          Add a new task to your todo list
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="title" 
              className="text-sm font-semibold flex items-center gap-1"
            >
              Title
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              disabled={isSubmitting}
              className="h-11 text-base"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Give your todo a clear, actionable title
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="description" 
              className="text-sm font-semibold"
            >
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              disabled={isSubmitting}
              className="h-11 text-base"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Provide additional context or notes
            </p>
          </div>

          {/* Priority Select */}
          <div className="space-y-2">
            <Label 
              htmlFor="priority" 
              className="text-sm font-semibold"
            >
              Priority Level
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TodoPriority)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="priority" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        option.value === 'low' ? 'bg-success' :
                        option.value === 'medium' ? 'bg-warning' :
                        'bg-destructive'
                      }`} />
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Set the urgency level for this task
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim()}
            className="w-full sm:w-auto h-11 px-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Todo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
