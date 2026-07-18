'use client';

import { motion } from 'framer-motion';
import type { BuildingDef } from '../../lib/village/map';

interface BuildingProps {
  def: BuildingDef;
  active: boolean;
  selected: boolean;
  occupied: boolean;
  scale?: number;
  onClick: () => void;
}

export default function Building({ def, active, selected, occupied, scale = 1, onClick }: BuildingProps) {
  const w = 108 * scale;
  const wallH = 58 * scale;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      className="absolute focus:outline-none group"
      style={{ left: 0, top: 0, width: 1, height: 1 }}
      aria-label={def.name}
    >
      <div style={{ transform: `translate(${-w / 2}px, ${-(wallH + 70 * scale)}px)`, position: 'relative', width: w, height: wallH + 90 * scale }}>
        {/* ground glow */}
        {active && (
          <div
            className="absolute rounded-full"
            style={{
              left: w / 2 - 46 * scale,
              top: wallH + 44 * scale,
              width: 92 * scale,
              height: 30 * scale,
              background: def.glow,
              filter: 'blur(10px)',
              opacity: 0.55,
              animation: 'pulseGlow 1.8s ease-in-out infinite',
            }}
          />
        )}

        {/* selection ring */}
        {selected && (
          <div
            className="absolute rounded-full border-2"
            style={{
              left: w / 2 - 50 * scale,
              top: wallH + 40 * scale,
              width: 100 * scale,
              height: 34 * scale,
              borderColor: '#F5EFE0',
              opacity: 0.9,
            }}
          />
        )}

        <svg
          width={w}
          height={wallH + 70 * scale}
          viewBox={`0 0 140 ${58 + 70}`}
          style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
        >
          {/* left wall */}
          <polygon points="22,40 70,64 70,124 22,104" fill={def.wallLeft} />
          {/* right wall */}
          <polygon points="70,64 118,40 118,104 70,124" fill={def.wallRight} />
          {/* windows */}
          <rect x="32" y="60" width="14" height="14" rx="2" fill={active ? '#FCE7A6' : '#EDE3C8'} opacity={0.9} />
          <rect x="86" y="60" width="14" height="14" rx="2" fill={active ? '#FCE7A6' : '#EDE3C8'} opacity={0.9} />
          {/* door */}
          <rect x="62" y="90" width="16" height="26" rx="3" fill="#4A3220" />
          {/* roof / top face */}
          <polygon points="70,4 118,40 70,64 22,40" fill={def.roof} stroke="#3A2A18" strokeOpacity={0.15} strokeWidth="1" />
          {/* ridge cap */}
          <polygon points="70,4 96,22 70,34 44,22" fill="#00000022" />
          {/* chimney */}
          <rect x="88" y="10" width="10" height="16" fill="#6B4226" />

          {/* smoke */}
          {active && (
            <g>
              <circle cx="93" cy="6" r="3" fill="#F5EFE0" opacity="0.8" style={{ animation: 'smoke 2.4s ease-out infinite' }} />
              <circle cx="93" cy="6" r="3" fill="#F5EFE0" opacity="0.6" style={{ animation: 'smoke 2.4s ease-out 0.8s infinite' }} />
              <circle cx="93" cy="6" r="3" fill="#F5EFE0" opacity="0.4" style={{ animation: 'smoke 2.4s ease-out 1.6s infinite' }} />
            </g>
          )}
        </svg>

        {/* icon badge */}
        <div
          className="absolute flex items-center justify-center rounded-full shadow-md"
          style={{
            left: w / 2 - 18 * scale,
            top: -14 * scale,
            width: 36 * scale,
            height: 36 * scale,
            background: '#F5EFE0',
            border: '2px solid #E8B84B',
            fontSize: 17 * scale,
          }}
        >
          {def.icon}
        </div>

        {/* label tag */}
        <div
          className="absolute whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            left: w / 2,
            top: wallH + 76 * scale,
            transform: 'translateX(-50%)',
            background: '#3A2A18',
            color: '#F5EFE0',
          }}
        >
          {def.name}
        </div>

        {!occupied && (
          <div
            className="absolute rounded-full text-[9px] px-1.5 py-0.5"
            style={{
              left: w / 2 - 24 * scale,
              top: -30 * scale,
              background: '#00000055',
              color: '#F5EFE0',
            }}
          >
            unstaffed
          </div>
        )}
      </div>
    </motion.button>
  );
}
