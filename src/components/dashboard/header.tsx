'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { BeeIcon } from "@/components/icons/bee-icon";
import { useAuth } from '@/context/auth-context';
import { Calendar, LogOut, MessageSquare } from 'lucide-react';
import { users, goals } from '@/lib/data'; // for manna, will be replaced later
import Link from 'next/link';
import { Chatbot } from './chatbot';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // In a real app, you'd get the current user and their specific goal.
  // For this prototype, we'll use mock data.
  const currentUser = users.find(u => u.name === 'Alex Queen') ?? users[0];
  const currentGoal = goals[0]; 

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
            <BeeIcon className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-xl font-semibold tracking-tighter text-foreground">
            Hive Goals
            </h1>
        </Link>
      </div>

      <nav className="ml-10 flex items-center gap-4">
        <Link href="/dashboard/calendar" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <Calendar className="h-5 w-5" />
            Team Calendar
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setIsChatbotOpen(true)}>
            <MessageSquare className="h-5 w-5" />
        </Button>
        <div className="text-right">
          <p className="text-sm font-medium">{user.email}</p>
          <p className="text-xs text-muted-foreground">{currentUser.manna.toLocaleString()} manna</p>
        </div>
        <Avatar>
          <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} data-ai-hint="person portrait" />
          <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      {currentUser && currentGoal && (
        <Chatbot
          isOpen={isChatbotOpen}
          onOpenChange={setIsChatbotOpen}
          userName={currentUser.name}
          goalTitle={currentGoal.title}
        />
      )}
    </header>
  );
}
