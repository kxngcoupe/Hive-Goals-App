'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { users, messages as initialMessages } from '@/lib/data';
import type { Message } from '@/lib/types';
import { Send } from 'lucide-react';

export default function MessageBoardPage() {
  const { user: authUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handlePostMessage = () => {
    if (!newMessage.trim() || !authUser) return;

    const post: Message = {
      id: `msg-${Date.now()}`,
      userId: users.find(u => u.email === authUser.email)?.id ?? 'user1',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => [post, ...prevMessages]);
    setNewMessage('');
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Message Board"
        description="A place for the team to connect and share updates."
      />
      <div className="mt-6 mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4 h-[60vh] overflow-y-auto pr-4">
              {messages.map((message) => {
                const author = getUserById(message.userId);
                return (
                  <div key={message.id} className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={author?.avatarUrl} alt={author?.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-primary">{author?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="p-3 mt-1 rounded-lg bg-muted/50">
                        <p className="text-sm text-foreground">{message.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex w-full items-start gap-4">
               <Avatar className="h-10 w-10 border">
                  <AvatarImage src={users.find(u => u.email === authUser?.email)?.avatarUrl} alt={authUser?.displayName ?? 'Me'} />
                  <AvatarFallback>{users.find(u => u.email === authUser?.email)?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[60px]"
                />
                <Button onClick={handlePostMessage} disabled={!newMessage.trim()} size="sm">
                  Post Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
