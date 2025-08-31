import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BeeIcon } from "@/components/icons/bee-icon";
import { users } from "@/lib/data";

export default function Header() {
  const currentUser = users[0];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <BeeIcon className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-xl font-semibold tracking-tighter text-foreground">
          BeeGoals
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground">{currentUser.points.toLocaleString()} points</p>
        </div>
        <Avatar>
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="person portrait" />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
