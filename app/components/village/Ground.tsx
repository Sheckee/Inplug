'use client';

import { useMemo } from 'react';
import {
  GRID_SIZE,
  TILE_H,
  TILE_W,
  WORLD_H,
  WORLD_W,
  hashRandom,
  key,
  toWorld,
} from '../../lib/village/isometric';
import { RIVER_TILES, ROAD_TILES } from '../../lib/village/map';

function diamondPoints(cx: number, cy: number, w: number, h: number) {
  return [
    [cx, cy - h / 2],
    [cx + w / 2, cy],
    [cx, cy + h / 2],
    [cx - w / 2, cy],
  ]
    .map((p) => p.join(','))
    .join(' ');
}

export default function Ground() {
  const tiles = useMemo(() => {
    const arr: { x: number; y: number; kind: 'grass' | 'road' | 'river'; shade: number }[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const k = key(x, y);
        const kind = RIVER_TILES.has(k) ? 'river' : ROAD_TILES.has(k) ? 'road' : 'grass';
        arr.push({ x, y, kind, shade: hashRandom(x, y, 9) });
      }
    }
    return arr;
  }, []);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
    >
      <defs>
        <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7FCBDB" />
          <stop offset="100%" stopColor="#4E9CB0" />
        </linearGradient>
        <linearGradient id="cliffGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A9946F" />
          <stop offset="45%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5A42" />
        </linearGradient>
      </defs>

      {/* rocky canyon walls beneath every river tile, carved-earth strata look */}
      {tiles
        .filter((t) => t.kind === 'river')
        .map((t) => {
          const p = toWorld(t.x, t.y);
          const cliffH = 22;
          const bottom = p.y + TILE_H / 2;
          const wallPts = [
            [p.x - TILE_W / 2, p.y],
            [p.x, bottom],
            [p.x, bottom + cliffH],
            [p.x - TILE_W / 2, p.y + cliffH],
          ]
            .map((pt) => pt.join(','))
            .join(' ');
          return (
            <g key={`cliff-${key(t.x, t.y)}`}>
              <polygon points={wallPts} fill="url(#cliffGrad)" opacity={0.9} />
              <line x1={p.x - TILE_W / 4} y1={p.y + TILE_H / 4 + 6} x2={p.x - TILE_W / 2 + 2} y2={p.y + 6} stroke="#5A4A34" strokeWidth={1} opacity={0.4} />
            </g>
          );
        })}

      {tiles.map((t) => {
        const p = toWorld(t.x, t.y);
        const pts = diamondPoints(p.x, p.y, TILE_W, TILE_H);
        if (t.kind === 'river') {
          return (
            <polygon
              key={key(t.x, t.y)}
              points={pts}
              fill="url(#riverGrad)"
              stroke="#3F8A9E"
              strokeWidth={1}
              opacity={0.95}
            />
          );
        }
        if (t.kind === 'road') {
          return (
            <polygon
              key={key(t.x, t.y)}
              points={pts}
              fill={t.shade > 0.5 ? '#C9BC9C' : '#D3C7A8'}
              stroke="#B7A87E"
              strokeWidth={0.5}
            />
          );
        }
        const fill = t.shade > 0.85 ? '#6B9E5E' : t.shade > 0.35 ? '#5B8C5A' : '#4F7D51';
        return (
          <polygon
            key={key(t.x, t.y)}
            points={pts}
            fill={fill}
            stroke="#456B47"
            strokeWidth={0.4}
            strokeOpacity={0.35}
          />
        );
      })}
    </svg>
  );
}
