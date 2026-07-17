import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);
const taskQueue = new Queue('agent-tasks', { connection: redis });

const server = Fastify({ logger: true });

server.register(cors, { origin: '*' });

// Health Check
server.get('/api/health', async () => ({ status: 'ok', timestamp: new Date() }));

// Routes
server.post('/api/agents', async (req, reply) => {
  const { name, role, model, systemPrompt } = req.body as any;
  const agent = await prisma.agent.create({
    data: { name, role, model, systemPrompt, workspaceId: 'default' }
  });
  return reply.send(agent);
});

server.post('/api/agents/:id/execute', async (req, reply) => {
  const { id } = req.params as { id: string };
  const { task } = req.body as { task: string };
  
  await taskQueue.add('execute', { agentId: id, task });
  return reply.send({ message: 'Task queued', agentId: id });
});

// AI Model Router (simplified)
import { modelRouter } from './services/modelRouter';
server.post('/api/chat', async (req, reply) => {
  const { messages, model } = req.body as any;
  const response = await modelRouter(messages, model);
  return reply.send(response);
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
