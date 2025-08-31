'use client';

import type { Reward } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EditRewardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reward: Reward;
  onSave: (reward: Reward) => void;
}

export function EditRewardDialog({ isOpen, onOpenChange, reward, onSave }: EditRewardDialogProps) {
  const [name, setName] = useState(reward.name);
  const [description, setDescription] = useState(reward.description);
  const [cost, setCost] = useState(reward.cost);

  useEffect(() => {
    setName(reward.name);
    setDescription(reward.description);
    setCost(reward.cost);
  }, [reward]);

  const handleSave = () => {
    onSave({
      ...reward,
      name,
      description,
      cost: Number(cost),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reward</DialogTitle>
          <DialogDescription>Make changes to the reward details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Manna Cost</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
