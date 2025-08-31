'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BeeIcon } from '@/components/icons/bee-icon';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';


export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, loading, error } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  
  // In a real app, you would validate the inviteId against your database.
  const inviteId = params.inviteId;


  const handleSignUp = async () => {
    const success = await signUp(email, password);

    if (success) {
      toast({
        title: 'Welcome to the Hive!',
        description: 'You have successfully signed up.',
      });
      router.push('/dashboard');
    } else if (error) {
        toast({
            title: 'Sign-up Error',
            description: error,
            variant: 'destructive',
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
            <Card className="shadow-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex items-center gap-2">
                    <BeeIcon className="h-10 w-10 text-primary" />
                    <h1 className="font-headline text-3xl font-semibold tracking-tighter text-foreground">
                    Hive Goals
                    </h1>
                </div>
                <CardTitle className="font-headline text-2xl">Join the Hive</CardTitle>
                <CardDescription>Create an account to accept your invitation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <Button onClick={handleSignUp} disabled={loading} className="w-full">
                    {loading ? 'Joining...' : 'Sign Up & Join Hive'}
                </Button>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                    Sign In
                </Link>
                </p>
            </CardFooter>
            </Card>
        </div>
    </main>
  );
}
