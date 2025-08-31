'use client';

import type { Task, User } from '@/lib/types';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import * as Tone from 'tone';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { Minus, Pencil, Plus } from 'lucide-react';
import { EditTaskDialog } from './edit-task-dialog';
import { Progress } from '../ui/progress';

type TaskItemProps = {
  task: Task;
  user?: User;
  onToggle: (taskId: string, isCompleted: boolean) => void;
  onProgressChange: (taskId: string, newProgress: number) => void;
};

export function TaskItem({ task: initialTask, user, onToggle, onProgressChange }: TaskItemProps) {
  const { isAdmin } = useAuth();
  const [task, setTask] = useState(initialTask);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const synth = useRef<Tone.Synth | null>(null);

  const isQuotaTask = useMemo(() => typeof task.quota === 'number', [task.quota]);

  useEffect(() => {
    // Initialize synth on the client side
    if (typeof window !== 'undefined') {
      synth.current = new Tone.Synth().toDestination();
    }
  }, []);
  
  const playSound = () => {
      if(synth.current) {
        synth.current.triggerAttackRelease('C5', '8n', Tone.now());
      }
  }

  const handleCheckedChange = (checked: boolean) => {
    setTask(prev => ({...prev, isCompleted: checked}))
    onToggle(task.id, checked);

    if (checked) {
      playSound();
    }
  };

  const handleProgressChange = (increment: number) => {
    const newProgress = Math.max(0, Math.min(task.quota!, (task.progress ?? 0) + increment));
    const isCompleted = newProgress >= task.quota!;
    
    setTask(prev => ({ ...prev, progress: newProgress, isCompleted }));
    onProgressChange(task.id, newProgress);

    if (isCompleted) {
        playSound();
    }
  }

  const handleTaskSave = (updatedTask: Task) => {
    setTask(updatedTask);
    setIsEditDialogOpen(false);
  };
  
  const progressPercentage = isQuotaTask ? ((task.progress ?? 0) / task.quota!) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 px-6 py-3 transition-colors hover:bg-secondary/50">
        <div className="flex items-center gap-4">
            {isQuotaTask ? (
                 <div className="flex h-5 w-5 items-center justify-center" />
            ) : (
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.isCompleted}
                    onCheckedChange={handleCheckedChange}
                    className="h-5 w-5"
                    aria-label={`Mark task '${task.description}' as complete`}
                />
            )}
            <label
                htmlFor={!isQuotaTask ? `task-${task.id}` : undefined}
                className={cn(
                'flex-1 cursor-pointer text-sm font-medium',
                task.isCompleted && 'text-muted-foreground line-through'
                )}
            >
                {task.description}
            </label>
            <Badge variant="outline" className="font-mono text-primary">{task.manna} manna</Badge>
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
        {isQuotaTask && (
            <div className="flex items-center gap-4 pl-[36px]">
                 <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleProgressChange(-1)} disabled={(task.progress ?? 0) === 0}>
                    <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <Progress value={progressPercentage} className="h-2" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                    {task.progress ?? 0} / {task.quota}
                </span>
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleProgressChange(1)} disabled={(task.progress ?? 0) >= task.quota!}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        )}
    </div>
  );
}
