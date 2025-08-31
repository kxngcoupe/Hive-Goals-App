'use server';

/**
 * @fileOverview A goal improvement suggestion AI agent.
 *
 * - getGoalImprovementSuggestions - A function that suggests edits to goals.
 * - GoalImprovementSuggestionsInput - The input type for the getGoalImprovementSuggestions function.
 * - GoalImprovementSuggestionsOutput - The return type for the getGoalImprovementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalImprovementSuggestionsInputSchema = z.object({
  goalHistory: z
    .string()
    .describe("A history of the user's past goals, including descriptions and outcomes."),
  currentGoal: z.string().describe('The description of the current goal.'),
});
export type GoalImprovementSuggestionsInput = z.infer<
  typeof GoalImprovementSuggestionsInputSchema
>;

const GoalImprovementSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Suggestions on how to improve the current goal.'),
});
export type GoalImprovementSuggestionsOutput = z.infer<
  typeof GoalImprovementSuggestionsOutputSchema
>;

export async function getGoalImprovementSuggestions(
  input: GoalImprovementSuggestionsInput
): Promise<GoalImprovementSuggestionsOutput> {
  return goalImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalImprovementSuggestionsPrompt',
  input: {schema: GoalImprovementSuggestionsInputSchema},
  output: {schema: GoalImprovementSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to help users improve their goals based on their past goal history.

Analyze the following goal history and provide suggestions on how to improve the current goal.

Goal History:
{{goalHistory}}

Current Goal:
{{currentGoal}}

Suggestions:`,
});

const goalImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'goalImprovementSuggestionsFlow',
    inputSchema: GoalImprovementSuggestionsInputSchema,
    outputSchema: GoalImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
