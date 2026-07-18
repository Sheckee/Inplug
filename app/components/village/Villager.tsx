'use client';

import { motion } from 'framer-motion';
import type { Agent } from '../../lib/store';

export type VillagerStatus = 'idle' | 'walking' | 'thinking' | 'done' | 'sleeping';

interface VillagerProps {
  agent: Agent;
  color: string;
  accent: string;
  icon: string;
  x: number;
  y: number;
  status: VillagerStatus;
  selected: boolean;
  zIndex: number;
  onClick: () => void;
}

const bubbleFor: Record<VillagerStatus, string | null> = {
  idle: null,
  walking: null,
  thinking: '💭',
  done: '✅',
  sleeping: '💤',
};

export default function Villager({ agent, color, accent, icon, x, y, status, selected, zIndex, onClick }: VillagerProps) {
  const isWalking = status === 'walking';
  const bubble = bubbleFor[status];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="absolute focus:outline-none"
      style={{ left: 0, top: 0, zIndex: 500000 + zIndex }}
      animate={{ x, y }}
      transition={{ duration: isWalking ? 1.1 : 0.4, ease: 'easeInOut' }}
      aria-label={agent.name}
    >
      <div className="relative" style={{ transform: 'translate(-14px, -46px)', width: 28, height: 46 }}>
        {/* shadow */}
        <div
          className="absolute rounded-full"
          style={{ left: 3, top: 40, width: 22, height: 7, background: '#00000040', filter: 'blur(1px)' }}
        />

        {bubble && (
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-[13px]"
            style={{ animation: 'bob 1.6s ease-in-out infinite' }}
          >
            {bubble}
          </div>
        )}

        {selected && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: '#E8B84B' }}
          />
        )}

        <svg
          width="28"
          height="40"
          viewBox="0 0 28 40"
          style={{
            animation: isWalking ? 'walkBounce 0.4s ease-in-out infinite' : 'bob 2.4s ease-in-out infinite',
          }}
        >
          {/* legs */}
          <rect x="9" y="30" width="4" height="8" rx="1.5" fill="#3A2A18" />
          <rect x="15" y="30" width="4" height="8" rx="1.5" fill="#3A2A18" />
          {/* body */}
          <rect x="7" y="17" width="14" height="15" rx="5" fill={color} />
          {/* arms */}
          <circle cx="6" cy="24" r="2.6" fill={color} />
          <circle cx="22" cy="24" r="2.6" fill={color} />
          {/* head */}
          <circle cx="14" cy="10" r="8.5" fill="#F1C79C" />
          {/* headband / role marker */}
          <path d="M5.5,7.5 a8.5,8.5 0 0,1 17,0 l-1,0.6 a7.7,7.7 0 0,0 -15,0 z" fill={accent} />
          {/* eyes */}
          <circle cx="11" cy="10.5" r="1.1" fill="#3A2A18" />
          <circle cx="17" cy="10.5" r="1.1" fill="#3A2A18" />
        </svg>

        {/* workplace badge */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            right: -4,
            top: 18,
            width: 13,
            height: 13,
            fontSize: 8,
            background: '#F5EFE0',
            border: `1.5px solid ${accent}`,
          }}
        >
          {icon}
        </div>
      </div>
    </motion.button>
  );
}
