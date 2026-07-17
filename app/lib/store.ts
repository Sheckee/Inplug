import { create } from 'zustand';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'error';
  mood: string;
}

interface AgentStore {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
}));
