'use server';
/**
 * @fileOverview A general purpose AI shopping assistant.
 *
 * - generalAssistantFlow - A function that handles general user queries.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneralAssistantInputSchema = z.object({
  query: z.string().describe('The user question about the store or products.'),
});
export type GeneralAssistantInput = z.infer<typeof GeneralAssistantInputSchema>;

const GeneralAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response in Spanish.'),
});
export type GeneralAssistantOutput = z.infer<
  typeof GeneralAssistantOutputSchema
>;

export async function generalAssistant(
  input: GeneralAssistantInput
): Promise<GeneralAssistantOutput> {
  return generalAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalAssistantPrompt',
  input: { schema: GeneralAssistantInputSchema },
  output: { schema: GeneralAssistantOutputSchema },
  prompt: `Eres "Noemia AI", un asistente de compras virtual amigable y servicial para la tienda de belleza y moda "Noemia".

Tu tarea es responder a las preguntas de los usuarios de manera concisa y útil. Ayuda con preguntas sobre productos, seguimiento de pedidos, políticas de la tienda o consejos de moda y belleza.

Toda tu respuesta debe estar obligatoriamente en español.

Pregunta del usuario: {{{query}}}`,
});

const generalAssistantFlow = ai.defineFlow(
  {
    name: 'generalAssistantFlow',
    inputSchema: GeneralAssistantInputSchema,
    outputSchema: GeneralAssistantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
