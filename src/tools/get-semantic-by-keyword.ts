import { z } from "zod";
import SemanticMemoryModel from "../models/SemanticMemory.js";

export const getSemanticMemoryByKeywordFunction = {
    description: 'Use this tool to get a semantic memory by keyword. Semantic memory contains abstract knowledge or factual information that is not directly related to the current conversation. It is used to store information that is important for the long term. For eg. - "Rahul\'s hometown is Mumbai"',
    parameters: z.object({
      userId: z.string().describe('The id of the human.'), // Fix this later, this is unsafe
      keywords: z.string().describe('The keywords to search for.'),
    }),
    execute: async ({ userId, keywords }: { userId: string, keywords: string }) => {
      console.log(`executing get semantic memory by keyword function for ${JSON.stringify({ userId, keywords }, null, 2)}`);
  
      try {
        const memories = await SemanticMemoryModel.find({ userId, memory: { $regex: keywords, $options: 'i' } }); // no await to let it run in the background
        return `Semantic memory found: ${memories.map((memory) => memory.memory).join('\n')}`;
      } catch (error) {
        console.error('Error getting semantic memory by keyword:', error);
        return `Sorry, I couldn't get the semantic memory. Please try again later.`;
      }
    },
  };