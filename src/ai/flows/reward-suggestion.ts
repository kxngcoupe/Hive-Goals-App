// reward-suggestion.ts
'use server';

/**
 * @fileOverview Suggests appropriate point values for rewards based on goal history and effort.
 *
 * - suggestRewardValue - A function that suggests reward values.
 * - SuggestRewardValueInput - The input type for the suggestRewardValue function.
 * - SuggestRewardValueOutput - The return type for the suggestRewardValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRewardValueInputSchema = z.object({
  goalHistory: z.string().describe('A summary of the user\'s goal history, including the goals achieved and the effort required.'),
  rewardDescription: z.string().describe('A description of the reward for which a point value is being suggested.'),
});
export type SuggestRewardValueInput = z.infer<typeof SuggestRewardValueInputSchema>;

const SuggestRewardValueOutputSchema = z.object({
  suggestedPointValue: z.number().describe('The suggested point value for the reward.'),
  reasoning: z.string().describe('The reasoning behind the suggested point value.'),
});
export type SuggestRewardValueOutput = z.infer<typeof SuggestRewardValueOutputSchema>;

export async function suggestRewardValue(input: SuggestRewardValueInput): Promise<SuggestRewardValueOutput> {
  return suggestRewardValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRewardValuePrompt',
  input: {schema: SuggestRewardValueInputSchema},
  output: {schema: SuggestRewardValueOutputSchema},
  prompt: `You are an expert in gamification and reward systems. Given a user's goal history and a description of a reward, you will suggest an appropriate point value for the reward.

Goal History: {{{goalHistory}}}
Reward Description: {{{rewardDescription}}}

Consider the effort required to achieve past goals and the desirability of the reward when determining the point value. Provide a short explanation for your suggestion.

Output the suggested point value as a number and the reasoning in the reasoning field.
`,
});

const suggestRewardValueFlow = ai.defineFlow(
  {
    name: 'suggestRewardValueFlow',
    inputSchema: SuggestRewardValueInputSchema,
    outputSchema: SuggestRewardValueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
