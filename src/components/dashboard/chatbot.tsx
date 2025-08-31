'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getMotivationalMessage, type MotivationalMessageInput } from '@/ai/flows/motivational-message-flow';
import { useToast } from '@/hooks/use-toast';
import { BeeIcon } from '../icons/bee-icon';
import { Sparkles } from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  goalTitle: string;
}

export function Chatbot({ isOpen, onOpenChange, userName, goalTitle }: ChatbotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      const input: MotivationalMessageInput = { userName, goalTitle };
      const response = await getMotivationalMessage(input);

      toast({
        title: 'Buzzy says...',
        description: response.message,
      });

    } catch (error) {
      console.error('Failed to get motivational message:', error);
      toast({
        title: 'Error',
        description: 'Buzzy is taking a nap. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      onOpenChange(false); // Close dialog after sending
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-center">
            <div className="mx-auto">
                <BeeIcon className="h-12 w-12 text-primary" />
            </div>
          <DialogTitle className="font-headline text-2xl">Talk to Buzzy</DialogTitle>
          <DialogDescription>
            Need a little buzz of encouragement? Ask our motivational mascot, Buzzy, for a kind word.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            className='w-full'
            size="lg"
          >
            {isLoading ? 'Thinking...' : 'Get Motivation'}
            <Sparkles className="ml-2 h-4 w-4"/>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
