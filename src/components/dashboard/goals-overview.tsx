'use client';

import { goals } from "@/lib/data";
import { GoalCard } from "@/components/dashboard/goal-card";
import { PageHeader } from "@/components/dashboard/page-header";

export default function GoalsOverview() {

  return (
    <section className="space-y-6">
      <PageHeader
        title="Active Goals"
        description="Track your progress and manage your team's objectives."
      />
      <div className="grid gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="relative group">
            <GoalCard goal={goal} />
          </div>
        ))}
      </div>
    </section>
  );
}
