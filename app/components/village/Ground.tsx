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
      </defs>
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
