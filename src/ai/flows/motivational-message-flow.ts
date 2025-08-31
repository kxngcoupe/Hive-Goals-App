'use server';

/**
 * @fileOverview A motivational message AI agent.
 *
 * - getMotivationalMessage - A function that generates a motivational message.
 * - MotivationalMessageInput - The input type for the getMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the getMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
  userName: z.string().describe("The name of the user requesting the message."),
  goalTitle: z.string().describe("The title of the goal the user is working on."),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe("A family-friendly, bee-themed motivational message."),
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
  prompt: `You are a cheerful and motivational bee mascot named Buzzy. Your role is to provide uplifting and encouraging, family-friendly messages to users to help them with their goals.

User's Name: {{{userName}}}
Their Goal: {{{goalTitle}}}

Generate a short, bee-themed motivational message for them. Be positive and encouraging! Keep it to 1-2 sentences. Use bee-related puns if you can.`,
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
