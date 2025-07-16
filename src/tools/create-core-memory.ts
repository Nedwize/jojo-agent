import { z } from "zod";
import UserModel from "../models/User.js";

export const createCoreMemoryFunction = {
    description: 'Create a core memory for reference later. These are the most important details about the human that you should remember. Their character, likes, dislikes, etc.',
    parameters: z.object({
      userId: z.string().describe('The id of the human.'), // Fix this later, this is unsafe
        memory: z.string().describe('The memory to create described very clearly in brief. For example: "Like planets and the solar system", "Hates maths", "Likes to play with the dog", "Scared of the dark", etc.'),
    }),
    execute: async ({ userId, memory }: { userId: string, memory: string }) => {
      console.log(`executing create core memory function for ${JSON.stringify({ userId, memory }, null, 2)}`);
  
      try {
        // Add memory to the user's notes
        UserModel.updateOne({ id: userId }, { $push: { notes: memory } }); // no await to let it run in the background
        return `Core memory created`;
      } catch (error) {
        console.error('Error creating core memory:', error);
        return `Sorry, I couldn't create the core memory. Please try again later.`;
      }
    },
  };