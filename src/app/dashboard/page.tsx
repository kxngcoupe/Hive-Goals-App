'use client';

import GoalsOverview from '@/components/dashboard/goals-overview';
import Leaderboard from '@/components/dashboard/leaderboard';
import RewardsCatalog from '@/components/dashboard/rewards-catalog';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GoalsOverview />
        </div>
        <div className="space-y-8">
          <Leaderboard />
          <RewardsCatalog />
        </div>
      </div>
    </div>
  );
}
