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
    .describe('Un array de productos complementarios sugeridos.'),
  reasoning: z
    .string()
    .describe('El razonamiento detrás de los productos sugeridos.'),
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
  prompt: `Eres un asistente de estilismo personal para una tienda de ropa moderna en línea. Tu tarea es sugerir productos que complementen el artículo que el usuario está viendo actualmente. Responde en español.

Descripción del Producto: {{{productDescription}}}
Categoría del Producto: {{{productCategory}}}
{{#if userPreferences}}Preferencias del Usuario: {{{userPreferences}}}{{/if}}`,
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
