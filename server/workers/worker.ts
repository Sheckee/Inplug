import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { env } from '../lib/env';

const prisma = new PrismaClient();
const connection = new Redis(env.REDIS_URL);

console.log('👷 Worker started...');

new Worker(
  'agent-tasks',
  async (job) => {
    const { agentId, task } = job.data;
    console.log(`📋 Executing task for agent ${agentId}: "${task}"`);

    // Update status to 'working' (redundant, but safe)
    await prisma.agent.update({
      where: { id: agentId },
      data: { status: 'working' },
    });

    // Dito mo pwedeng ilagay ang actual background AI processing
    // Halimbawa: mag-call ng API, mag-generate ng image, etc.
    // Para sa demo, mag-simulate lang tayo ng gawain:
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update status back to 'idle'
    await prisma.agent.update({
      where: { id: agentId },
      data: { status: 'idle' },
    });

    console.log(`✅ Task completed for agent ${agentId}`);
  },
  { connection }
);
