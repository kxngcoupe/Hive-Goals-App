'use client';

import type { Reward } from '@/lib/types';
import { useState } from 'react';
import { rewards as initialRewards } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Lightbulb, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { EditRewardDialog } from './edit-reward-dialog';

export default function RewardsCatalog() {
  const { isAdmin } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const handleEditClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsEditDialogOpen(true);
  };

  const handleSaveReward = (updatedReward: Reward) => {
    setRewards((prevRewards) =>
      prevRewards.map((reward) => (reward.id === updatedReward.id ? updatedReward : reward))
    );
    setIsEditDialogOpen(false);
    setSelectedReward(null);
  };

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
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="flex-col h-auto px-2 py-1">
                  <Badge className="font-mono text-base bg-primary/20 text-primary-foreground hover:bg-primary/30">
                    {reward.cost} manna
                  </Badge>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(reward)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {selectedReward && (
        <EditRewardDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          reward={selectedReward}
          onSave={handleSaveReward}
        />
      )}
    </Card>
  );
}
