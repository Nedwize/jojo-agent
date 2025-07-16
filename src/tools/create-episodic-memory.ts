import { z } from "zod";
import EpisodicMemoryModel from "../models/EpisodicMemory.js";

export const createEpisodicMemoryFunction = {
    description: 'Create a temporal episodic memory for reference later. Remember that saying Hi or greetings are NOT important details, you are supposed to save events here.',
    parameters: z.object({
      userId: z.string().describe('The id of the human.'), // Fix this later, this is unsafe
      summary: z.string().describe('A short summary of the memory'),
      details: z.string().describe('A detailed description of the memory'),
      eventType: z.enum(['user_message', 'inferred_result']).describe('The type of event that occurred'),
      actor: z.enum(['assistant', 'user']).describe('The actor who created the memory - was it told by the user or the assistant inferred it?'),
    }),
    execute: async ({ userId, summary, details, eventType, actor }: { userId: string, summary: string, details: string, eventType: 'user_message' | 'inferred_result', timestamp: Date, actor: 'assistant' | 'user' }) => {
      console.log(`executing create episodic memory function for ${JSON.stringify({ userId, summary, details, eventType, actor }, null, 2)}`);
  
      try {
        EpisodicMemoryModel.create({ userId, summary, details, eventType, actor }); // no await to let it run in the background
        return `Episodic memory created`;
      } catch (error) {
        console.error('Error creating episodic memory:', error);
        return `Sorry, I couldn't create the episodic memory. Please try again later.`;
      }
    },
  };