'use client';

import { useMemo } from 'react';
import { depthOf, toWorld } from '../../lib/village/isometric';
import { WATERFALL_TILE, WINDMILL_TILE, generateDecor } from '../../lib/village/map';

function Tree({ sway }: { sway: number }) {
  return (
    <svg width="34" height="46" viewBox="0 0 34 46" style={{ overflow: 'visible' }}>
      <ellipse cx="17" cy="43" rx="10" ry="3" fill="#2E4A2F" opacity="0.35" />
      <rect x="14" y="26" width="6" height="16" rx="2" fill="#6B4226" />
      <g style={{ transformOrigin: '17px 24px', animation: `sway 4s ease-in-out ${sway}s infinite` }}>
        <circle cx="17" cy="18" r="13" fill="#4C7A4A" />
        <circle cx="10" cy="22" r="9" fill="#5B8C5A" />
        <circle cx="24" cy="22" r="9" fill="#5B8C5A" />
        <circle cx="17" cy="9" r="9" fill="#6B9E5E" />
      </g>
    </svg>
  );
}

function Bush() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" style={{ overflow: 'visible' }}>
      <ellipse cx="11" cy="14" rx="9" ry="2" fill="#2E4A2F" opacity="0.3" />
      <circle cx="7" cy="9" r="6" fill="#5B8C5A" />
      <circle cx="15" cy="9" r="6" fill="#4C7A4A" />
      <circle cx="11" cy="6" r="6" fill="#6B9E5E" />
    </svg>
  );
}

function Flower({ hue }: { hue: number }) {
  const colors = ['#E7A8C4', '#E8B84B', '#F5EFE0', '#B7A6E0'];
  const c = colors[Math.floor(hue * colors.length) % colors.length];
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ overflow: 'visible' }}>
      <circle cx="4" cy="10" r="2.2" fill={c} />
      <circle cx="8" cy="11" r="1.8" fill={c} opacity="0.85" />
      <circle cx="6" cy="7" r="2" fill={c} opacity="0.7" />
    </svg>
  );
}

function Lantern({ lit }: { lit: boolean }) {
  return (
    <svg width="12" height="30" viewBox="0 0 12 30" style={{ overflow: 'visible' }}>
      <rect x="5" y="10" width="2" height="16" fill="#6B4226" />
      <rect x="2" y="2" width="8" height="9" rx="2" fill={lit ? '#F6D98A' : '#C9BC9C'} stroke="#6B4226" strokeWidth="1" />
      {lit && <circle cx="6" cy="6.5" r="7" fill="#F6D98A" opacity="0.35" style={{ filter: 'blur(3px)' }} />}
    </svg>
  );
}

function Windmill() {
  return (
    <svg width="52" height="86" viewBox="0 0 52 86" style={{ overflow: 'visible' }}>
      <ellipse cx="20" cy="82" rx="14" ry="3" fill="#2E4A2F" opacity="0.3" />
      <polygon points="10,82 16,30 24,30 26,82" fill="#E8DCC4" stroke="#8B5E3C" strokeWidth="1" />
      <circle cx="19" cy="28" r="4" fill="#8B5E3C" />
      <g style={{ transformOrigin: '19px 28px', animation: 'spin 6s linear infinite' }}>
        <rect x="17.2" y="2" width="3.6" height="26" rx="1.8" fill="#F5EFE0" />
        <rect x="17.2" y="28" width="3.6" height="26" rx="1.8" fill="#F5EFE0" transform="rotate(90 19 28)" />
        <rect x="17.2" y="28" width="3.6" height="26" rx="1.8" fill="#E8DCC4" transform="rotate(180 19 28)" />
        <rect x="17.2" y="28" width="3.6" height="26" rx="1.8" fill="#E8DCC4" transform="rotate(270 19 28)" />
      </g>
    </svg>
  );
}

function Waterfall() {
  return (
    <svg width="30" height="60" viewBox="0 0 30 60" style={{ overflow: 'visible' }}>
      <rect x="6" y="0" width="16" height="60" fill="url(#fallGrad)" opacity="0.85" />
      <defs>
        <linearGradient id="fallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEFF7" />
          <stop offset="100%" stopColor="#6FB8C9" />
        </linearGradient>
      </defs>
      <rect x="6" y="0" width="16" height="60" fill="transparent" style={{ animation: 'shimmer 1.6s linear infinite' }} />
    </svg>
  );
}

export default function Decor({ isNight }: { isNight: boolean }) {
  const items = useMemo(() => generateDecor(), []);

  return (
    <>
      {items.map((it) => {
        const p = toWorld(it.x, it.y);
        const z = depthOf(it.x, it.y);
        const swaySeed = (it.x * 3 + it.y) % 5;
        return (
          <div
            key={`${it.type}-${it.x}-${it.y}`}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              transform:
                it.type === 'tree'
                  ? 'translate(-17px, -44px)'
                  : it.type === 'bush'
                  ? 'translate(-11px, -15px)'
                  : it.type === 'lantern'
                  ? 'translate(-6px, -28px)'
                  : 'translate(-7px, -13px)',
              zIndex: z * 10 + 3,
            }}
          >
            {it.type === 'tree' && <Tree sway={swaySeed} />}
            {it.type === 'bush' && <Bush />}
            {it.type === 'flower' && <Flower hue={(it.x * 7 + it.y * 3) % 10 / 10} />}
            {it.type === 'lantern' && <Lantern lit={isNight} />}
          </div>
        );
      })}
      {/* Windmill */}
      {(() => {
        const p = toWorld(WINDMILL_TILE.x, WINDMILL_TILE.y);
        return (
          <div
            className="absolute"
            style={{ left: p.x, top: p.y, transform: 'translate(-20px, -82px)', zIndex: depthOf(WINDMILL_TILE.x, WINDMILL_TILE.y) * 10 + 3 }}
          >
            <Windmill />
          </div>
        );
      })()}
      {/* Waterfall */}
      {(() => {
        const p = toWorld(WATERFALL_TILE.x, WATERFALL_TILE.y);
        return (
          <div
            className="absolute"
            style={{ left: p.x, top: p.y, transform: 'translate(-15px, -20px)', zIndex: depthOf(WATERFALL_TILE.x, WATERFALL_TILE.y) * 10 + 4 }}
          >
            <Waterfall />
          </div>
        );
      })()}
    </>
  );
}
