// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { WorkerOptions, cli } from '@livekit/agents';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Import our modules
import { connectDatabase } from './database/connection.js';
import { startExpressServer } from './express-server.js';
import livekitAgent from './livekit-agent.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

// Initialize the application
async function initializeApp() {
  console.log('🚀 Starting Bunny Agent application...');

  // Connect to database
  console.log('🗄️  Initializing database connection...');
  await connectDatabase();

  // Start Express server
  console.log('📦 Initializing Express server...');
  return startExpressServer();
}

// Start the application
const server = await initializeApp();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Express server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Express server closed');
    process.exit(0);
  });
});

// Start the LiveKit agent
console.log('🤖 Initializing LiveKit agent...');

// Export the agent as default and start the CLI
export default livekitAgent;

// Start the LiveKit agent worker
cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
