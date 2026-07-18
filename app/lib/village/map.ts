import { GRID_SIZE, GridPoint, hashRandom, key, lPath } from './isometric';

export type BuildingId =
  | 'hall'
  | 'library'
  | 'workshop'
  | 'studio'
  | 'farm'
  | 'clinic'
  | 'observatory'
  | 'automation'
  | 'marketplace'
  | 'memoryTree';

export interface BuildingDef {
  id: BuildingId;
  name: string;
  icon: string;
  description: string;
  anchor: GridPoint; // top-left grid cell of footprint
  footprint: { w: number; h: number };
  roof: string; // roof color
  wallLeft: string;
  wallRight: string;
  top: string;
  glow: string;
  agentTitle: string; // what kind of AI lives here
  roleKeywords: string[]; // used to match Agent.role loosely
}

// All buildings are arranged as spokes around the central Village Hall.
export const BUILDINGS: BuildingDef[] = [
  {
    id: 'hall',
    name: 'Village Hall',
    icon: '🏛',
    description: 'Where every request first arrives, and every answer is finally sealed.',
    anchor: { x: 7, y: 7 },
    footprint: { w: 2, h: 2 },
    roof: '#C9673F',
    wallLeft: '#8B5E3C',
    wallRight: '#A9723F',
    top: '#E8B84B',
    glow: '#E8B84B',
    agentTitle: 'Chief AI',
    roleKeywords: ['chief', 'orchestrator', 'manager', 'lead', 'assistant'],
  },
  {
    id: 'library',
    name: 'Library',
    icon: '📚',
    description: 'Shelves of everything the village has ever learned.',
    anchor: { x: 3, y: 4 },
    footprint: { w: 2, h: 2 },
    roof: '#5B8C5A',
    wallLeft: '#6B4226',
    wallRight: '#8B5E3C',
    top: '#E8DCC4',
    glow: '#8FD0FF',
    agentTitle: 'Knowledge',
    roleKeywords: ['knowledge', 'librarian', 'research assistant', 'writer', 'content'],
  },
  {
    id: 'workshop',
    name: 'Workshop',
    icon: '⚒',
    description: 'Hammers, gears and code -- where things get built.',
    anchor: { x: 10, y: 4 },
    footprint: { w: 2, h: 2 },
    roof: '#8A867E',
    wallLeft: '#6B4226',
    wallRight: '#8B5E3C',
    top: '#D8CBB0',
    glow: '#E8B84B',
    agentTitle: 'Developer',
    roleKeywords: ['developer', 'engineer', 'coder', 'programmer'],
  },
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎨',
    description: 'Paint, pixels and pattern -- the village\'s creative corner.',
    anchor: { x: 10, y: 10 },
    footprint: { w: 2, h: 2 },
    roof: '#C97FA0',
    wallLeft: '#8B5E3C',
    wallRight: '#A9723F',
    top: '#F5EFE0',
    glow: '#E7A8C4',
    agentTitle: 'Designer',
    roleKeywords: ['designer', 'design', 'creative', 'artist'],
  },
  {
    id: 'farm',
    name: 'Research Farm',
    icon: '🌾',
    description: 'Rows of ideas planted, watered and slowly harvested.',
    anchor: { x: 3, y: 10 },
    footprint: { w: 2, h: 2 },
    roof: '#C9A63F',
    wallLeft: '#6B4226',
    wallRight: '#8B5E3C',
    top: '#DCEAC0',
    glow: '#C9E28A',
    agentTitle: 'Researcher',
    roleKeywords: ['research', 'researcher', 'analyst', 'scientist'],
  },
  {
    id: 'clinic',
    name: 'Clinic',
    icon: '🩺',
    description: 'Checks every answer for a healthy pulse before it leaves.',
    anchor: { x: 7, y: 1 },
    footprint: { w: 2, h: 2 },
    roof: '#E8DCC4',
    wallLeft: '#8B5E3C',
    wallRight: '#A9723F',
    top: '#F0E6F6',
    glow: '#B7A6E0',
    agentTitle: 'QA',
    roleKeywords: ['qa', 'quality', 'tester', 'reviewer'],
  },
  {
    id: 'observatory',
    name: 'Observatory',
    icon: '📊',
    description: 'A tall dome where every number in the village is watched.',
    anchor: { x: 7, y: 12 },
    footprint: { w: 2, h: 2 },
    roof: '#3F5C6C',
    wallLeft: '#6B4226',
    wallRight: '#8B5E3C',
    top: '#CFE3EA',
    glow: '#6FB8C9',
    agentTitle: 'Analytics',
    roleKeywords: ['analytics', 'data', 'metrics'],
  },
  {
    id: 'automation',
    name: 'Automation Lab',
    icon: '⚙',
    description: 'Gears turn themselves, day and night, mostly unattended.',
    anchor: { x: 12, y: 7 },
    footprint: { w: 2, h: 2 },
    roof: '#8A867E',
    wallLeft: '#6B4226',
    wallRight: '#8B5E3C',
    top: '#D8CBB0',
    glow: '#A6A29B',
    agentTitle: 'Automation',
    roleKeywords: ['automation', 'ops', 'devops', 'workflow'],
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: '🏪',
    description: 'Stalls of deals, numbers and the business of the village.',
    anchor: { x: 1, y: 7 },
    footprint: { w: 2, h: 2 },
    roof: '#C9673F',
    wallLeft: '#8B5E3C',
    wallRight: '#A9723F',
    top: '#F5EFE0',
    glow: '#E8B84B',
    agentTitle: 'Business',
    roleKeywords: ['business', 'sales', 'marketing', 'finance'],
  },
  {
    id: 'memoryTree',
    name: 'Memory Tree',
    icon: '🧠',
    description: 'Roots that hold what every villager has said and learned.',
    anchor: { x: 9, y: 9 },
    footprint: { w: 1, h: 1 },
    roof: '#5B8C5A',
    wallLeft: '#6B4226',
    wallRight: '#8B5E3C',
    top: '#DCEAC0',
    glow: '#9BD79B',
    agentTitle: 'Shared Memory',
    roleKeywords: ['memory', 'shared'],
  },
];

export interface HouseDef {
  id: string;
  anchor: GridPoint;
  roof: string;
}

export const HOUSES: HouseDef[] = [
  { id: 'house-1', anchor: { x: 2, y: 1 }, roof: '#C9673F' },
  { id: 'house-2', anchor: { x: 12, y: 1 }, roof: '#5B8C5A' },
  { id: 'house-3', anchor: { x: 1, y: 12 }, roof: '#C97FA0' },
  { id: 'house-4', anchor: { x: 13, y: 12 }, roof: '#3F5C6C' },
  { id: 'house-5', anchor: { x: 6, y: 13 }, roof: '#C9A63F' },
  { id: 'house-6', anchor: { x: 10, y: 13 }, roof: '#8A867E' },
];

export const HALL = BUILDINGS[0];

function footprintCells(anchor: GridPoint, footprint: { w: number; h: number }): GridPoint[] {
  const cells: GridPoint[] = [];
  for (let dx = 0; dx < footprint.w; dx++) {
    for (let dy = 0; dy < footprint.h; dy++) {
      cells.push({ x: anchor.x + dx, y: anchor.y + dy });
    }
  }
  return cells;
}

// Occupied cells (buildings + houses) that ground decoration should avoid.
export const OCCUPIED = new Set<string>();
BUILDINGS.forEach((b) => footprintCells(b.anchor, b.footprint).forEach((c) => OCCUPIED.add(key(c.x, c.y))));
HOUSES.forEach((h) => footprintCells(h.anchor, { w: 1, h: 1 }).forEach((c) => OCCUPIED.add(key(c.x, c.y))));

// Entrance tile (just "south" of a building footprint) -- used as the point a
// villager walks to when heading to work, and as the road's target tile.
export function entranceOf(anchor: GridPoint, footprint: { w: number; h: number }): GridPoint {
  return { x: anchor.x, y: anchor.y + footprint.h };
}

export function houseEntrance(h: HouseDef): GridPoint {
  return { x: h.anchor.x, y: h.anchor.y + 1 };
}

export function buildingCenter(b: BuildingDef): GridPoint {
  return { x: b.anchor.x + (b.footprint.w - 1) / 2, y: b.anchor.y + (b.footprint.h - 1) / 2 };
}

// --- Roads: spokes from the Hall to every other building -------------------
export const ROAD_TILES = new Set<string>();
const hallEntrance = entranceOf(HALL.anchor, HALL.footprint);
BUILDINGS.slice(1).forEach((b) => {
  const target = entranceOf(b.anchor, b.footprint);
  const path = lPath(hallEntrance, target);
  path.forEach((p) => ROAD_TILES.add(key(p.x, p.y)));
});
HOUSES.forEach((h) => {
  const target = { x: h.anchor.x, y: h.anchor.y + 1 };
  const path = lPath(hallEntrance, target);
  // Only add the tail of the path near the house so the network doesn't get too busy.
  path.slice(-3).forEach((p) => ROAD_TILES.add(key(p.x, p.y)));
});

// --- River: two decorative corner streams, deliberately clear of buildings -
export const RIVER_TILES = new Set<string>([
  '12,0', '13,0', '14,0', '13,1', '14,1', '14,2', '14,3', '13,2',
  '0,11', '0,12', '0,13', '0,14', '1,13', '1,14', '2,14', '1,12',
]);

export const WATERFALL_TILE = { x: 14, y: 0 };
export const WINDMILL_TILE = { x: 12, y: 2 };

// --- Decorations: trees / flowers / lanterns scattered deterministically ---
export type DecorType = 'tree' | 'flower' | 'lantern' | 'bush';
export interface DecorItem {
  type: DecorType;
  x: number;
  y: number;
}

export function generateDecor(): DecorItem[] {
  const items: DecorItem[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const k = key(x, y);
      if (OCCUPIED.has(k) || RIVER_TILES.has(k)) continue;
      if (x === WINDMILL_TILE.x && y === WINDMILL_TILE.y) continue;
      const onRoad = ROAD_TILES.has(k);
      const r = hashRandom(x, y, 1);
      if (onRoad) {
        // Lanterns line the roads only, sparsely.
        if (hashRandom(x, y, 2) < 0.06) items.push({ type: 'lantern', x, y });
        continue;
      }
      if (r < 0.14) items.push({ type: 'tree', x, y });
      else if (r < 0.22) items.push({ type: 'bush', x, y });
      else if (r < 0.3) items.push({ type: 'flower', x, y });
    }
  }
  return items;
}
