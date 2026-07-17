import { create } from 'zustand';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'error';
  model: string;
  systemPrompt: string;
}

interface AgentStore {
  agents: Agent[];
  loading: boolean;
  fetchAgents: () => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<void>;
  executeTask: (agentId: string, task: string) => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  loading: false,
  
  fetchAgents: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      set({ agents: data, loading: false });
    } catch (err) {
      console.error('Failed to fetch agents', err);
      set({ loading: false });
    }
  },

  createAgent: async (data) => {
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const newAgent = await res.json();
    set((state) => ({ agents: [...state.agents, newAgent] }));
  },

  executeTask: async (agentId, task) => {
    await fetch(`/api/agents/${agentId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
  },
}));
