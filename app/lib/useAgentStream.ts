import { useEffect, useState } from 'react';

export function useAgentStream(agentId: string) {
  const [tokens, setTokens] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'thinking' | 'working'>('idle');

  useEffect(() => {
    if (!agentId) return;
    const eventSource = new EventSource(`/api/agents/${agentId}/stream`);

    eventSource.addEventListener('status', (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
    });

    eventSource.addEventListener('token', (e) => {
      const data = JSON.parse(e.data);
      setTokens((prev) => [...prev, data.token]);
    });

    return () => eventSource.close();
  }, [agentId]);

  return { tokens, status, fullText: tokens.join('') };
}
