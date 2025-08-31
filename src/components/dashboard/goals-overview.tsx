'use client';

import { useState } from 'react';
import { goals } from "@/lib/data";
import { GoalCard } from "@/components/dashboard/goal-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "../ui/button";
import { Chatbot } from "./chatbot";
import { useAuth } from "@/context/auth-context";
import { users } from "@/lib/data";
import { Sparkles } from "lucide-react";

export default function GoalsOverview() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [selectedGoalTitle, setSelectedGoalTitle] = useState('');
  const { user: authUser } = useAuth();
  
  const currentUser = users.find(u => u.email === authUser?.email) ?? users[0];

  const handleMotivationClick = (goalTitle: string) => {
    setSelectedGoalTitle(goalTitle);
    setIsChatbotOpen(true);
  };

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
             <div className="absolute top-4 right-20 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button size="sm" onClick={() => handleMotivationClick(goal.title)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Motivation
                </Button>
             </div>
          </div>
        ))}
      </div>
      
      {isChatbotOpen && (
        <Chatbot 
          isOpen={isChatbotOpen}
          onOpenChange={setIsChatbotOpen}
          userName={currentUser.name}
          goalTitle={selectedGoalTitle}
        />
      )}
    </section>
  );
}
