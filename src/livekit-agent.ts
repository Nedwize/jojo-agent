import { type JobContext, defineAgent, llm, multimodal } from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import { z } from 'zod';

// Weather function context
const weatherFunction = {
  description: 'Get the weather in a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }: { location: string }) => {
    console.debug(`executing weather function for ${location}`);

    try {
      const response = await fetch(`https://wttr.in/${location}?format=%C+%t`);
      if (!response.ok) {
        throw new Error(`Weather API returned status: ${response.status}`);
      }
      const weather = await response.text();
      return `The weather in ${location} right now is ${weather}.`;
    } catch (error) {
      console.error('Weather API error:', error);
      return `Sorry, I couldn't get the weather information for ${location}. Please try again later.`;
    }
  },
};

// Define the LiveKit agent
export const livekitAgent = defineAgent({
  entry: async (ctx: JobContext) => {
    await ctx.connect();
    console.log('🔄 Waiting for participant to join...');

    const participant = await ctx.waitForParticipant();
    console.log('✅ Participant joined:', participant.identity);
    console.log(`🤖 Starting multimodal assistant agent for ${participant.identity}`);

    // Initialize the OpenAI realtime model
    const model = new openai.realtime.RealtimeModel({
      instructions:
        'You are a helpful assistant. You can help with various tasks and provide weather information when requested.',
    });

    // Create function context with weather function
    const fncCtx: llm.FunctionContext = {
      weather: weatherFunction,
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
        text: 'Hello! How can I help you today? I can assist with various tasks and even provide weather information if you need it.',
      }),
    );

    // Create initial response
    session.response.create();

    console.log('🎯 Agent session started successfully');
  },
});

export default livekitAgent;
