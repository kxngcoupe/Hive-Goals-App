'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/dashboard/header';
import GoalsOverview from '@/components/dashboard/goals-overview';
import Leaderboard from '@/components/dashboard/leaderboard';
import RewardsCatalog from '@/components/dashboard/rewards-catalog';
import { BeeIcon } from '@/components/icons/bee-icon';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <BeeIcon className="h-12 w-12 animate-pulse text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GoalsOverview />
          </div>
          <div className="space-y-8">
            <Leaderboard />
            <RewardsCatalog />
          </div>
        </div>
      </main>
    </div>
  );
}
