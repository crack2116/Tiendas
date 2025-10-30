'use server';
/**
 * @fileOverview An AI agent that suggests complementary products based on the item the user is currently viewing.
 *
 * - suggestComplementaryProducts - A function that handles the suggestion of complementary products.
 * - SuggestComplementaryProductsInput - The input type for the suggestComplementaryProducts function.
 * - SuggestComplementaryProductsOutput - The return type for the suggestComplementaryProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestComplementaryProductsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product the user is currently viewing.'),
  productCategory: z.string().describe('The category of the product.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional: The user preferences to take into account.'),
});
export type SuggestComplementaryProductsInput = z.infer<
  typeof SuggestComplementaryProductsInputSchema
>;

const SuggestComplementaryProductsOutputSchema = z.object({
  suggestedProducts: z
    .array(z.string())
    .describe('An array of suggested complementary products.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested products.'),
});
export type SuggestComplementaryProductsOutput = z.infer<
  typeof SuggestComplementaryProductsOutputSchema
>;

export async function suggestComplementaryProducts(
  input: SuggestComplementaryProductsInput
): Promise<SuggestComplementaryProductsOutput> {
  return suggestComplementaryProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComplementaryProductsPrompt',
  input: {schema: SuggestComplementaryProductsInputSchema},
  output: {schema: SuggestComplementaryProductsOutputSchema},
  prompt: `You are a personal styling assistant for an online modern clothing store. Suggest products to the user that complement the item they are currently viewing, so they can easily discover items that go well together and complete their look. Respond with a list of products and your reasoning for recommending them.

Product Description: {{{productDescription}}}
Product Category: {{{productCategory}}}
{{#if userPreferences}}User Preferences: {{{userPreferences}}}{{/if}}`,
});

const suggestComplementaryProductsFlow = ai.defineFlow(
  {
    name: 'suggestComplementaryProductsFlow',
    inputSchema: SuggestComplementaryProductsInputSchema,
    outputSchema: SuggestComplementaryProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
