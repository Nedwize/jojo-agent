import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/user.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3030;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use(morgan('combined'));
// Routes
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'bunny-agent-express-server',
    port: PORT,
  });
});

// Start Express server
export function startExpressServer() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Express server running on port ${PORT}`);
  });

  return server;
}

export { app };
