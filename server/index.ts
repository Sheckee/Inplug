import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { Queue } from 'bullmq';
import { streamModel } from './services/modelRouter';
import { env } from './lib/env';

console.log('⚙️ Initializing Prisma client...');
const prisma = new PrismaClient();

console.log('⚙️ Connecting to Redis...');
const redis = new Redis(env.REDIS_URL);

console.log('⚙️ Creating BullMQ queue...');
const taskQueue = new Queue('agent-tasks', { connection: redis });

console.log('⚙️ Creating Fastify server...');
const server = Fastify({ logger: true });
server.register(cors, { origin: '*' });

// HEALTH CHECK
server.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// AGENT CRUD
server.get('/api/agents', async () => {
  const agents = await prisma.agent.findMany({
    where: { workspaceId: 'default' },
  });
  return agents;
});

server.post('/api/agents', async (req, reply) => {
  const { name, role, model, systemPrompt } = req.body as any;
  if (!name) return reply.status(400).send({ error: 'Name is required' });
  
  const agent = await prisma.agent.create({
    data: {
      name,
      role: role || 'Worker',
      model: model || 'openai',
      systemPrompt: systemPrompt || 'You are a helpful assistant.',
      workspaceId: 'default',
      status: 'idle',
    },
  });
  return reply.send(agent);
});

// TASK EXECUTION
server.post('/api/agents/:id/execute', async (req, reply) => {
  const { id } = req.params as { id: string };
  const { task } = req.body as { task: string };

  if (!task) return reply.status(400).send({ error: 'Task is required' });

  await prisma.agent.update({
    where: { id },
    data: { status: 'working' },
  });

  await taskQueue.add('execute', { agentId: id, task });
  return reply.send({ message: 'Task queued', agentId: id });
});

// SSE STREAMING
server.get('/api/agents/:id/stream', async (req, reply) => {
  const { id } = req.params as { id: string };
  const task = (req.query as any).task || 'Explain quantum computing in simple terms.';

  const agent = await prisma.agent.findUnique({
    where: { id },
  });
  if (!agent) {
    reply.raw.write(`event: error\ndata: ${JSON.stringify({ error: 'Agent not found' })}\n\n`);
    reply.raw.end();
    return;
  }

  const model = agent.model || 'openai';

  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  reply.raw.write(`event: status\ndata: ${JSON.stringify({ agentId: id, status: 'thinking' })}\n\n`);

  try {
    const messages = [{ role: 'user', content: task }];
    const openAIStream = await streamModel(messages, model);
    const reader = openAIStream.getReader();
    const decoder = new TextDecoder();

    async function pump() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const token = data.choices?.[0]?.delta?.content || '';
              if (token) {
                reply.raw.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
              }
            } catch (e) { /* ignore parse errors */ }
          }
        }
      }
      await prisma.agent.update({
        where: { id },
        data: { status: 'idle' },
      });
      reply.raw.write(`event: status\ndata: ${JSON.stringify({ agentId: id, status: 'idle' })}\n\n`);
      reply.raw.end();
    }
    pump();
  } catch (err) {
    await prisma.agent.update({
      where: { id },
      data: { status: 'error' },
    });
    reply.raw.write(`event: error\ndata: ${JSON.stringify({ error: (err as Error).message })}\n\n`);
    reply.raw.end();
  }
});

// WORKFLOW CRUD
server.post('/api/workflows', async (req, reply) => {
  const { name, definition } = req.body as any;
  const workflow = await prisma.workflow.create({
    data: {
      name: name || 'Untitled',
      definition,
      workspaceId: 'default',
    },
  });
  return reply.send(workflow);
});

server.get('/api/workflows', async () => {
  return prisma.workflow.findMany({
    where: { workspaceId: 'default' },
  });
});

// START SERVER
const start = async () => {
  console.log('🚀 Attempting to start Fastify server...');
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('✅ Fastify server is running on http://localhost:3001');
  } catch (err) {
    console.error('❌ Fastify failed to start:', err);
    server.log.error(err);
    process.exit(1);
  }
};
start();
