// Core isometric (2:1 dimetric) projection helpers.
// The village is laid out on a logical grid; every tile / building / villager
// has a grid coordinate {x, y} which we project to screen pixels here.

export const TILE_W = 64; // width of a ground tile diamond
export const TILE_H = 32; // height of a ground tile diamond
export const GRID_SIZE = 15; // logical grid is GRID_SIZE x GRID_SIZE

export interface GridPoint {
  x: number;
  y: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

/** Convert a logical grid coordinate to a screen-space pixel offset. */
export function toScreen(gx: number, gy: number): ScreenPoint {
  return {
    x: (gx - gy) * (TILE_W / 2),
    y: (gx + gy) * (TILE_H / 2),
  };
}

/** Depth sort key -- higher = drawn later (in front). */
export function depthOf(gx: number, gy: number): number {
  return gx + gy;
}

/** Deterministic pseudo-random in [0, 1) seeded by grid coords, stable across SSR/CSR. */
export function hashRandom(gx: number, gy: number, seed = 0): number {
  const s = Math.sin(gx * 12.9898 + gy * 78.233 + seed * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

export function key(gx: number, gy: number): string {
  return `${gx},${gy}`;
}

/** Simple Manhattan L-shaped path of tiles between two grid points (inclusive). */
export function lPath(from: GridPoint, to: GridPoint): GridPoint[] {
  const tiles: GridPoint[] = [];
  let x = from.x;
  const y0 = from.y;
  const stepX = to.x > from.x ? 1 : -1;
  while (x !== to.x) {
    tiles.push({ x, y: y0 });
    x += stepX;
  }
  let y = y0;
  const stepY = to.y > y0 ? 1 : -1;
  while (y !== to.y) {
    tiles.push({ x: to.x, y });
    y += stepY;
  }
  tiles.push({ x: to.x, y: to.y });
  return tiles;
}

// The whole village lives inside a fixed "world" canvas. These constants were
// chosen so that grid coordinates 0..GRID_SIZE-1 always land safely inside
// WORLD_W x WORLD_H, leaving room for tall building sprites above their tile.
export const WORLD_ORIGIN_X = 480;
export const WORLD_ORIGIN_Y = 120;
export const WORLD_W = 960;
export const WORLD_H = 660;

/** Grid coordinate -> absolute pixel position inside the world canvas. */
export function toWorld(gx: number, gy: number): ScreenPoint {
  const s = toScreen(gx, gy);
  return { x: WORLD_ORIGIN_X + s.x, y: WORLD_ORIGIN_Y + s.y };
}
