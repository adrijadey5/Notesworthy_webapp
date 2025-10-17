'use server';

import { summarizeNote } from '@/ai/flows/summarize-note';


export async function getSummary(text: string) {
    if (!text || text.trim().length < 20) {
      return { summary: 'Please select more text to get a summary.' };
    }
    try {
      const { summary } = await summarizeNote({ text });
      return { summary };
    } catch (error) {
      console.error(error);
      return { summary: 'Sorry, we couldn\'t generate a summary at this time.' };
    }
}
