'use client';

import type { Task, User } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import * as Tone from 'tone';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';
import { EditTaskDialog } from './edit-task-dialog';

type TaskItemProps = {
  task: Task;
  user?: User;
  onToggle: (taskId: string, isCompleted: boolean) => void;
};

export function TaskItem({ task: initialTask, user, onToggle }: TaskItemProps) {
  const { isAdmin } = useAuth();
  const [task, setTask] = useState(initialTask);
  const [isChecked, setIsChecked] = useState(task.isCompleted);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const synth = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    // Initialize synth on the client side
    if (typeof window !== 'undefined') {
      synth.current = new Tone.Synth().toDestination();
    }
  }, []);

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggle(task.id, checked);

    if (checked && synth.current) {
      // Play a sound on task completion
      synth.current.triggerAttackRelease('C5', '8n', Tone.now());
    }
  };

  const handleTaskSave = (updatedTask: Task) => {
    setTask(updatedTask);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-secondary/50">
      <Checkbox
        id={`task-${task.id}`}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="h-5 w-5"
        aria-label={`Mark task '${task.description}' as complete`}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={cn(
          'flex-1 cursor-pointer text-sm font-medium',
          isChecked && 'text-muted-foreground line-through'
        )}
      >
        {task.description}
      </label>
      <Badge variant="outline" className="font-mono text-primary">{task.points} pts</Badge>
      {user && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      {isAdmin && (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="h-4 w-4" />
            </Button>
            <EditTaskDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                task={task}
                onSave={handleTaskSave}
            />
        </>
      )}
    </div>
  );
}
