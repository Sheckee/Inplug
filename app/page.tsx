'use client';

import { useEffect, useState } from 'react';
import { useAgentStore } from './lib/store';
import { useAgentStream } from './lib/useAgentStream';
import Link from 'next/link';

export default function Home() {
  const { agents, fetchAgents, executeTask } = useAgentStore();
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const { tokens, status, fullText } = useAgentStream(activeAgentId || '');

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleRunTask = (agentId: string) => {
    if (!taskInput.trim()) {
      alert('Please type a task first!');
      return;
    }
    setActiveAgentId(agentId);
    executeTask(agentId, taskInput);
  };

  const rooms = agents.length > 0 ? agents.map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    icon: a.role === 'Developer' ? '💻' :
          a.role === 'Researcher' ? '📚' :
          a.role === 'Designer' ? '🎨' : '🤖'
  })) : [
    { id: '1', name: 'Dev Bot', role: 'Developer', icon: '💻' },
    { id: '2', name: 'Research Bot', role: 'Researcher', icon: '📚' },
  ];

  return (
    <main className="w-screen h-screen flex flex-col bg-bg p-4 relative overflow-hidden">
      {/* Header with Navigation */}
      <header className="flex justify-between items-center z-10">
        <h1 className="text-2xl pixel-text text-accent">PixelHQ AI</h1>
        <div className="flex gap-6 items-center">
          <span className="text-sm text-gray-400">⚡ {activeAgentId ? 'Working' : 'Idle'}</span>
          <Link href="/workflows" className="text-sm pixel-text text-info hover:underline">
            Workflow Builder
          </Link>
        </div>
      </header>

      {/* Office Canvas */}
      <div className="flex-1 relative mt-4 border-2 border-panel bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 h-full w-full">
          {rooms.map((room) => {
            const isActive = activeAgentId === room.id;
            return (
              <div
                key={room.id}
                className={`relative bg-panel/50 border-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer
                  ${isActive ? 'border-accent/80 shadow-lg shadow-accent/20' : 'border-panel hover:border-accent/50'}`}
                onClick={() => handleRunTask(room.id)}
              >
                <span className="text-4xl mb-1">{room.icon}</span>
                <span className="pixel-text text-xs text-gray-400">{room.name}</span>
                <span className="text-[10px] text-gray-500">{room.role}</span>
                
                {/* Animated pixel worker */}
                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-8 transition-all
                  ${isActive && status === 'thinking' ? 'pixel-worker-thinking' : 'pixel-worker-idle'}`} />

                {/* Rain */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div className="w-px h-4 bg-blue-500/30 absolute top-0 left-10 animate-[drop_2s_linear_infinite]" />
                  <div className="w-px h-4 bg-blue-500/30 absolute top-0 left-20 animate-[drop_2.5s_linear_infinite]" />
                  <div className="w-px h-4 bg-blue-500/30 absolute top-0 left-30 animate-[drop_1.8s_linear_infinite]" />
                </div>

                {/* Status badge */}
                {isActive && (
                  <div className="absolute top-2 right-2 px-1 py-0.5 bg-panel border border-accent/40 rounded text-[10px] pixel-text text-accent">
                    {status === 'thinking' ? '⚡' : '✓'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Task Input Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-20">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-1 bg-panel/90 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent/50"
            placeholder="Type a task e.g. 'Write a Python script to sort a list'..."
          />
          <button
            onClick={() => rooms.length > 0 && handleRunTask(rooms[0].id)}
            className="bg-accent text-black px-6 py-3 rounded-lg pixel-text text-xs hover:bg-accent/80 disabled:opacity-50"
            disabled={!taskInput.trim()}
          >
            RUN
          </button>
        </div>

        {/* Live Console Overlay */}
        {activeAgentId && status !== 'idle' && (
          <div className="absolute bottom-20 left-4 right-4 bg-panel/90 border-2 border-accent/30 rounded-lg p-4 backdrop-blur-sm max-h-48 overflow-y-auto font-mono text-sm text-gray-300 shadow-2xl animate-in slide-in-from-bottom-2 fade-in z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="pixel-text text-xs text-accent">▶ CONSOLE</span>
              <span className="text-xs text-gray-500">{status}</span>
            </div>
            <div className="flex flex-col gap-1">
              {tokens.map((t, i) => (
                <span key={i} className="text-green-400/80">{t}</span>
              ))}
              {status === 'thinking' && <span className="animate-pulse text-gray-500">▍</span>}
            </div>
          </div>
        )}

        {/* Mailbox */}
        <div className="absolute bottom-4 right-4 bg-panel p-2 rounded-lg border border-accent/30 flex items-center gap-2 cursor-pointer hover:bg-panel/80 z-10">
          <span className="text-lg">📨</span>
          <span className="text-xs pixel-text text-accent">3</span>
        </div>
      </div>
    </main>
  );
}
