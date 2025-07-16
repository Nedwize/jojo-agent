import { z } from "zod";
import SemanticMemoryModel from "../models/SemanticMemory.js";

export const createSemanticMemoryFunction = {
    description: 'Use this tool to create a semantic memory. Semantic memory contains abstract knowledge or factual information that is not directly related to the current conversation. It is used to store information that is important for the long term. For eg. - "Rahul\'s hometown is Mumbai"',
    parameters: z.object({
      userId: z.string().describe('The id of the human.'), // Fix this later, this is unsafe
      memory: z.string().describe('The factual memory to be saved.'),
    }),
    execute: async ({ userId, memory }: { userId: string, memory: string }) => {
      console.log(`executing create semantic memory function for ${JSON.stringify({ userId, memory }, null, 2)}`);
  
      try {
        SemanticMemoryModel.create({ userId, memory }); // no await to let it run in the background
        return `Semantic memory created`;
      } catch (error) {
        console.error('Error creating semantic memory:', error);
        return `Sorry, I couldn't create the semantic memory. Please try again later.`;
      }
    },
  };