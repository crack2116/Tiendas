'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-suggests-complementary-products.ts';
import '@/ai/flows/general-assistant-flow.ts';
