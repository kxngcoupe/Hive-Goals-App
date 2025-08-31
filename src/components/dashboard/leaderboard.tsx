'use client';

import type { User } from '@/lib/types';
import { users as initialUsers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/page-header';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Link as LinkIcon, Shield, Trophy } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Leaderboard() {
  const { isAdmin, user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const sortedUsers = [...users].sort((a, b) => b.manna - a.manna);

  const rankIcons = [
    <Trophy key="1" className="h-5 w-5 text-yellow-500 fill-yellow-500" />,
    <Trophy key="2" className="h-5 w-5 text-gray-400 fill-gray-400" />,
    <Trophy key="3" className="h-5 w-5 text-yellow-700 fill-yellow-700" />,
  ];

  const handleRoleChange = (userId: string, newRole: 'Admin' | 'Member') => {
    // In a real app, this would be an API call.
    // For now, we update the local state.
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  const handleInviteClick = () => {
    // In a real app, this would be a unique, secure token.
    const inviteLink = `${window.location.origin}/join/new`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: 'Invite Link Copied!',
      description: 'The invite link has been copied to your clipboard.',
    });
  };

  const RoleIcon = ({ role }: { role: 'Admin' | 'Member' }) => {
    if (role === 'Admin') {
      return <Crown className="h-4 w-4 text-primary" />;
    }
    return <Shield className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <PageHeader title="Leaderboard" description="See who's buzzing at the top of the hive." />
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow key={user.id} className={index < 3 ? 'bg-secondary/50' : ''}>
                <TableCell className="w-12 text-center font-bold text-lg">
                  {rankIcons[index] || <span className="text-muted-foreground">{index + 1}</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.manna.toLocaleString()} manna</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {isAdmin ? (
                    <div className="flex items-center justify-end gap-2">
                      <Badge variant="outline" className="flex items-center gap-1.5">
                        <RoleIcon role={user.role} />
                        <span>{user.role}</span>
                      </Badge>
                      <Select
                        value={user.role}
                        onValueChange={(value: 'Admin' | 'Member') => handleRoleChange(user.id, value)}
                        disabled={user.email === authUser?.email} // Admin can't change their own role
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Set role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <RoleIcon role={user.role} />
                      <span>{user.role}</span>
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       {isAdmin && (
        <CardFooter className="border-t pt-6">
          <Button onClick={handleInviteClick} className="w-full">
            <LinkIcon className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
