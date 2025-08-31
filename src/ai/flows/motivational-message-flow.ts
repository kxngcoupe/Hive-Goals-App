'use server';

/**
 * @fileOverview A flow for generating bee-themed motivational messages.
 *
 * - getMotivationalMessage - Generates a motivational message.
 * - MotivationalMessageInput - The input type for the getMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the getMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MotivationalMessageInputSchema = z.object({
  userName: z.string().describe('The name of the user to motivate.'),
  goalTitle: z.string().describe('The title of the goal the user is working on.'),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

export const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('The motivational, bee-themed, family-friendly message.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function getMotivationalMessage(
  input: MotivationalMessageInput
): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are a cheerful and motivational bee mascot for a productivity app called "Hive Goals".
Your name is Buzzy.
Your purpose is to provide short, encouraging, family-friendly, and bee-themed push notifications to users.
Keep the messages positive and under 25 words. Use bee-related puns.

Generate a message for a user named {{userName}} who is working on the goal: "{{goalTitle}}".`,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
