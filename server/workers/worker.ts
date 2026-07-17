import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const connection = new Redis(process.env.REDIS_URL!);

new Worker('agent-tasks', async (job) => {
  const { agentId, task } = job.data;
  console.log(`Executing task for agent ${agentId}: ${task}`);
  // Call AI, update DB, etc.
  await prisma.agent.update({
    where: { id: agentId },
    data: { status: 'working' }
  });
  // Simulate work
  await new Promise(r => setTimeout(r, 5000));
  await prisma.agent.update({
    where: { id: agentId },
    data: { status: 'idle' }
  });
}, { connection });
