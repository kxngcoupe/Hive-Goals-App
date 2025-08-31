import Header from '@/components/dashboard/header';
import GoalsOverview from '@/components/dashboard/goals-overview';
import Leaderboard from '@/components/dashboard/leaderboard';
import RewardsCatalog from '@/components/dashboard/rewards-catalog';

export default function Home() {
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
