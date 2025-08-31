import { rewards } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Lightbulb, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RewardsCatalog() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <PageHeader
          title="Rewards Catalog"
          description="Spend your hard-earned manna on sweet rewards."
        >
          <Button variant="outline" size="sm">
            <Lightbulb className="mr-2 h-4 w-4" />
            AI Suggest
          </Button>
        </PageHeader>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <p className="font-medium">{reward.name}</p>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
              </div>
              <Button size="sm" variant="ghost" className="flex-col h-auto px-2 py-1">
                <Badge className="font-mono text-base bg-primary/20 text-primary-foreground hover:bg-primary/30">
                  {reward.cost} manna
                </Badge>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
