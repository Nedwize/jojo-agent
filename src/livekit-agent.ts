import { type JobContext, defineAgent, llm, multimodal } from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import { z } from 'zod';
import UserModel, { type User } from './models/User.js';
import { constructPrompt } from './prompts/characters.js';
import { createEpisodicMemoryFunction } from './tools/create-episodic-memory.js';

// Define the LiveKit agent
export const livekitAgent = defineAgent({
  entry: async (ctx: JobContext) => {
    await ctx.connect();
    console.log('🔄 Waiting for participant to join...');

    const participant = await ctx.waitForParticipant();
    console.log('✅ Participant joined:', participant.identity);
    console.log(`🤖 Starting multimodal assistant agent for ${participant.identity}`);

    const userId = participant.identity.split('voice_assistant_user_')[1];
    const user = await UserModel.findOne({ id: userId });

    console.log('👤 User:', user);

    // Initialize the OpenAI realtime model
    const model = new openai.realtime.RealtimeModel({
      instructions: constructPrompt(user?.character || 'bunny', user as User),
      voice: 'alloy',
    });

    // Create function context with weather function
    const fncCtx: llm.FunctionContext = {
      createEpisodeMemory:  createEpisodicMemoryFunction,
    };

    // Create the multimodal agent
    const agent = new multimodal.MultimodalAgent({ model, fncCtx });

    // Start the agent session
    const session = await agent
      .start(ctx.room, participant)
      .then((session) => session as openai.realtime.RealtimeSession);

    // Send initial greeting
    session.conversation.item.create(
      llm.ChatMessage.create({
        role: llm.ChatRole.ASSISTANT,
        text: 'Hello! How are you today? What is going on?',
      }),
    );

    // Create initial response
    session.response.create();

    console.log('🎯 Agent session started successfully');
  },
});

export default livekitAgent;
