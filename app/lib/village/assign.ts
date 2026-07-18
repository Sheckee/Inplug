import type { Agent } from '../store';
import { BUILDINGS, BuildingDef, HOUSES } from './layout';

export interface Villager {
  agent: Agent;
  building: BuildingDef;
  homeIndex: number;
  seatIndex: number; // which villager # in this building (for offsetting sprites)
}

// Buildings that can host real agents (the Hall can, but we keep it reserved
// for the "chief" persona if one exists, otherwise anyone can be routed here).
const ASSIGNABLE = BUILDINGS;

function matchBuilding(role: string): BuildingDef | null {
  const r = role.toLowerCase();
  for (const b of ASSIGNABLE) {
    if (b.roleKeywords.some((kw) => r.includes(kw))) return b;
  }
  return null;
}

export function assignVillagers(agents: Agent[]): Villager[] {
  const seatCounts = new Map<string, number>();
  let fallbackCursor = 1; // skip index 0 (hall) for pure round robin fallback

  return agents.map((agent, i) => {
    let building = matchBuilding(agent.role || '');
    if (!building) {
      building = ASSIGNABLE[fallbackCursor % ASSIGNABLE.length];
      fallbackCursor++;
    }
    const seatIndex = seatCounts.get(building.id) ?? 0;
    seatCounts.set(building.id, seatIndex + 1);
    return {
      agent,
      building,
      homeIndex: i % HOUSES.length,
      seatIndex,
    };
  });
}
