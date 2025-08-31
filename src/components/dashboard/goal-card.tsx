'use client';

import type { Goal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { TaskItem } from '@/components/dashboard/task-item';
import { useState, useMemo, useCallback } from 'react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckSquare, Pencil } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { EditGoalDialog } from './edit-goal-dialog';

export function GoalCard({ goal: initialGoal }: { goal: Goal }) {
  const { isAdmin } = useAuth();
  const [goal, setGoal] = useState(initialGoal);
  const [tasks, setTasks] = useState(goal.tasks);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { totalProgress, totalQuota } = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (typeof task.quota === 'number') {
          acc.totalQuota += task.quota;
          acc.totalProgress += task.progress ?? 0;
        } else {
          // Treat non-quota tasks as quota 1
          acc.totalQuota += 1;
          if (task.isCompleted) {
            acc.totalProgress += 1;
          }
        }
        return acc;
      },
      { totalProgress: 0, totalQuota: 0 }
    );
  }, [tasks]);

  const progress = useMemo(() => (totalQuota > 0 ? (totalProgress / totalQuota) * 100 : 0), [totalProgress, totalQuota]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.isCompleted).length, [tasks]);

  const handleTaskToggle = useCallback((taskId: string, isCompleted: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted } : task
      )
    );
  }, []);

  const handleProgressChange = useCallback((taskId: string, newProgress: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const isCompleted = task.quota ? newProgress >= task.quota : task.isCompleted;
          return { ...task, progress: newProgress, isCompleted };
        }
        return task;
      })
    );
  }, []);
  
  const handleGoalSave = (updatedGoal: Goal) => {
    setGoal(updatedGoal);
    setTasks(updatedGoal.tasks); // Assume tasks might be edited too
    setIsEditDialogOpen(false);
  };
  
  const deadline = parseISO(goal.deadline);
  const daysLeft = differenceInDays(deadline, new Date());

  return (
    <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl">{goal.title}</CardTitle>
            <CardDescription className="mt-1">{goal.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'} className="flex-shrink-0">
              <CalendarIcon className="mr-1.5 h-3 w-3" />
              {daysLeft > 0 ? `${daysLeft} days left` : `Due ${format(deadline, 'MMM d')}`}
            </Badge>
            {isAdmin && (
                <>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <EditGoalDialog 
                        isOpen={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        goal={goal}
                        onSave={handleGoalSave}
                    />
                </>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>{totalProgress} / {totalQuota} Tasks</span>
            </div>
            <div className="flex-1">
                <Progress value={progress} className="h-2" />
            </div>
            <span>{Math.round(progress)}%</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="tasks" className="border-t">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium">
              Tasks ({completedTasks}/{tasks.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} onProgressChange={handleProgressChange} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
