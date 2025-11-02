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
    .describe('Un array de nombres de productos complementarios sugeridos, en español.'),
  reasoning: z
    .string()
    .describe('La justificación en español de por qué estos productos son una buena combinación.'),
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
  prompt: `Eres un asistente de estilismo personal para una tienda de ropa y belleza en línea. Tu tarea es sugerir productos que complementen el artículo que el usuario está viendo.

**Toda tu respuesta debe estar obligatoriamente en español.** El campo 'reasoning' debe ser una explicación en español. El array 'suggestedProducts' debe contener nombres de tipos de productos también en español.

Datos del producto actual:
- Descripción: {{{productDescription}}}
- Categoría: {{{productCategory}}}

{{#if userPreferences}}Preferencias adicionales del usuario: {{{userPreferences}}}{{/if}}`,
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
