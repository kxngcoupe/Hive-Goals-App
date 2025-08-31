'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { BeeIcon } from "@/components/icons/bee-icon";
import { useAuth } from '@/context/auth-context';
import { LogOut } from 'lucide-react';
import { users } from '@/lib/data'; // for manna, will be replaced later

export default function Header() {
  const { user, signOut } = useAuth();
  const currentUser = users.find(u => u.name === 'Alex Queen') ?? users[0]; // mock data for manna

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <BeeIcon className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-xl font-semibold tracking-tighter text-foreground">
          Hive Goals
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
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
    </header>
  );
}
