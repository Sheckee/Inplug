'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Villager } from '../../lib/village/assign';
import type { JobRecord } from '../../lib/village/types';

interface SidePanelProps {
  villager: Villager | null;
  isActive: boolean;
  status: 'idle' | 'thinking' | 'working';
  liveText: string;
  activeTask: string;
  jobs: JobRecord[];
  onClose: () => void;
  onRunHere: () => void;
  taskInput: string;
}

const statusColors: Record<string, string> = {
  idle: '#8A867E',
  working: '#E8B84B',
  thinking: '#E8B84B',
  error: '#C9673F',
};

function Portrait({ color, accent, icon }: { color: string; accent: string; icon: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#F5EFE0" stroke={accent} strokeWidth="3" />
      <circle cx="32" cy="40" r="17" fill={color} />
      <circle cx="32" cy="22" r="13" fill="#F1C79C" />
      <path d="M14,20 a18,18 0 0,1 36,0 l-2,1.4 a16,16 0 0,0 -32,0 z" fill={accent} />
      <circle cx="27" cy="22.5" r="1.6" fill="#3A2A18" />
      <circle cx="37" cy="22.5" r="1.6" fill="#3A2A18" />
      <text x="32" y="58" textAnchor="middle" fontSize="14">{icon}</text>
    </svg>
  );
}

export default function SidePanel({
  villager,
  isActive,
  status,
  liveText,
  activeTask,
  jobs,
  onClose,
  onRunHere,
  taskInput,
}: SidePanelProps) {
  return (
    <AnimatePresence>
      {villager && (
        <motion.div
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          className="safe-top safe-bottom absolute top-0 right-0 h-full w-full sm:w-[320px] z-40 p-2 sm:p-3"
        >
          <div className="h-full rounded-2xl bg-[#F5EFE0] border-2 border-[#C9BC9C] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-start justify-between p-4 pb-2">
              <div className="flex items-center gap-3 min-w-0">
                <Portrait color={villager.building.wallRight} accent={villager.building.glow} icon={villager.building.icon} />
                <div className="min-w-0">
                  <div className="font-display text-base text-[#3A2A18] leading-tight truncate">{villager.agent.name}</div>
                  <div className="text-xs text-[#8B5E3C] truncate">{villager.agent.role}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: statusColors[isActive ? status : villager.agent.status] || statusColors.idle }}
                    />
                    <span className="text-[10px] uppercase tracking-wide text-[#8B5E3C]">
                      {isActive ? status : villager.agent.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#8B5E3C] hover:text-[#3A2A18] active:text-[#3A2A18] text-lg leading-none w-9 h-9 shrink-0 flex items-center justify-center -mr-1.5 -mt-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4 text-sm">
              <div className="rounded-xl bg-white/50 border border-[#E8DCC4] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[#8B5E3C] mb-1">Workplace</div>
                <div className="text-[#3A2A18] font-medium">{villager.building.icon} {villager.building.name}</div>
                <div className="text-xs text-[#8B5E3C] mt-1">{villager.building.description}</div>
              </div>

              <div className="rounded-xl bg-white/50 border border-[#E8DCC4] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[#8B5E3C] mb-1">Current Task</div>
                <div className="text-[#3A2A18]">
                  {isActive && activeTask ? activeTask : 'No active task right now.'}
                </div>
              </div>

              {isActive && status !== 'idle' && (
                <div className="rounded-xl bg-[#3A2A18] text-[#F5EFE0] p-3 font-mono text-xs max-h-40 overflow-y-auto">
                  <div className="text-[10px] uppercase tracking-wide opacity-60 mb-1">Thinking…</div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {liveText || '…'}
                    {status === 'thinking' && <span className="animate-pulse">▍</span>}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-white/50 border border-[#E8DCC4] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[#8B5E3C] mb-1">Memory Kernel</div>
                <div className="text-[#3A2A18] text-xs whitespace-pre-wrap leading-relaxed">
                  {villager.agent.systemPrompt || 'This villager has not been given a memory kernel yet.'}
                </div>
              </div>

              <div className="rounded-xl bg-white/50 border border-[#E8DCC4] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[#8B5E3C] mb-1">LLM</div>
                <div className="text-[#3A2A18] text-xs">{villager.agent.model || 'unassigned'}</div>
              </div>

              <div className="rounded-xl bg-white/50 border border-[#E8DCC4] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[#8B5E3C] mb-2">Recent Jobs</div>
                {jobs.length === 0 && <div className="text-xs text-[#8B5E3C]/70">No jobs yet -- send this villager a quest.</div>}
                <ul className="flex flex-col gap-2">
                  {jobs.map((j, i) => (
                    <li key={i} className="text-xs border-l-2 border-[#E8B84B] pl-2">
                      <div className="text-[#3A2A18] font-medium truncate">{j.task}</div>
                      <div className="text-[#8B5E3C] truncate">{j.response || '…'}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 border-t border-[#E8DCC4]">
              <button
                onClick={onRunHere}
                disabled={!taskInput.trim()}
                className="w-full rounded-xl bg-[#5B8C5A] hover:bg-[#4F7D51] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5EFE0] text-xs font-semibold py-2.5"
              >
                Send current quest to {villager.agent.name}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
