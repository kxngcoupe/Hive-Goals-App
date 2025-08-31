'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BeeIcon } from '../icons/bee-icon';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading, error } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async (action: 'signIn' | 'signUp') => {
    let success = false;
    if (action === 'signIn') {
      success = await signIn(email, password);
    } else {
      success = await signUp(email, password);
    }

    if (success) {
      toast({
        title: 'Success!',
        description: `You have successfully ${action === 'signIn' ? 'signed in' : 'signed up'}.`,
      });
      router.push('/dashboard');
    } else if (error) {
        toast({
            title: 'Authentication Error',
            description: error,
            variant: 'destructive',
        });
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center gap-2">
            <BeeIcon className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-3xl font-semibold tracking-tighter text-foreground">
            Hive Goals
            </h1>
        </div>
        <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in or create an account to continue</CardDescription>
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => handleAuth('signIn')} disabled={loading} className="flex-1">
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Button onClick={() => handleAuth('signUp')} disabled={loading} variant="outline" className="flex-1">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </div>
      </CardContent>
       <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Have an invite link?{' '}
          <Link href="/join/new" className="font-medium text-primary hover:underline">
            Join a Hive
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
