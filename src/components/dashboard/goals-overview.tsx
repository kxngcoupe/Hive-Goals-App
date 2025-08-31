import { goals } from "@/lib/data";
import { GoalCard } from "@/components/dashboard/goal-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export default function GoalsOverview() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Active Goals"
        description="Track your progress and manage your team's objectives."
      >
        <Button>
          <Lightbulb className="mr-2" />
          AI Suggestions
        </Button>
      </PageHeader>
      <div className="grid gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  );
}
