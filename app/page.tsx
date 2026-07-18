'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { useAgentStore, type Agent } from './lib/store';
import { useAgentStream } from './lib/useAgentStream';
import { assignVillagers } from './lib/village/assign';
import { BUILDINGS, HOUSES, buildingCenter, entranceOf, houseEntrance } from './lib/village/map';
import { toWorld, WORLD_H, WORLD_W, depthOf } from './lib/village/isometric';
import type { JobRecord } from './lib/village/types';
import type { VillagerStatus } from './components/village/Villager';

import SkyLayer from './components/village/SkyLayer';
import Ground from './components/village/Ground';
import Decor from './components/village/Decor';
import Building from './components/village/Building';
import Villager from './components/village/Villager';
import HUD from './components/village/HUD';
import TaskDock from './components/village/TaskDock';
import SidePanel from './components/village/SidePanel';

const FALLBACK_AGENTS: Agent[] = [
  { id: 'demo-dev', name: 'Wren', role: 'Developer', status: 'idle', model: 'openai', systemPrompt: 'You write clean, working code and explain it simply.' },
  { id: 'demo-research', name: 'Sage', role: 'Researcher', status: 'idle', model: 'anthropic', systemPrompt: 'You research topics thoroughly and cite what you find.' },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function Home() {
  const { agents: storeAgents, fetchAgents, executeTask } = useAgentStore();
  const agents = storeAgents.length > 0 ? storeAgents : FALLBACK_AGENTS;

  const [taskInput, setTaskInput] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'walking' | 'thinking' | 'done'>('idle');
  const [jobHistory, setJobHistory] = useState<Record<string, JobRecord[]>>({});

  const [isNight, setIsNight] = useState(false);
  const [weather, setWeather] = useState<'clear' | 'rain'>('clear');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const lastTaskRef = useRef('');
  const prevStatusRef = useRef<'idle' | 'thinking' | 'working'>('idle');
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const { tokens, status, fullText } = useAgentStream(activeAgentId || '');

  useEffect(() => {
    fetchAgents();
    // Default to real device time so the village opens looking the way the
    // person's own day/night actually looks -- toggle button overrides it.
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour >= 19);
  }, []);

  const villagers = useMemo(() => assignVillagers(agents), [agents]);
  const selectedVillager = villagers.find((v) => v.agent.id === selectedAgentId) || null;
  const activeVillager = villagers.find((v) => v.agent.id === activeAgentId) || null;

  const occupiedBuildingIds = useMemo(() => new Set(villagers.map((v) => v.building.id)), [villagers]);
  const activeBuildingId = activeVillager?.building.id ?? null;

  // Kick the walk -> thinking -> done -> home state machine whenever a run starts.
  const handleRun = (agentId: string, task: string) => {
    if (!task.trim()) return;
    lastTaskRef.current = task;
    setSelectedAgentId(agentId);
    setActiveAgentId(agentId);
    setPhase('walking');
    executeTask(agentId, task);
    window.setTimeout(() => {
      setPhase((p) => (p === 'walking' ? 'thinking' : p));
    }, 1150);
  };

  useEffect(() => {
    if (prevStatusRef.current !== 'idle' && status === 'idle' && activeAgentId) {
      setJobHistory((h) => {
        const list = h[activeAgentId] || [];
        return {
          ...h,
          [activeAgentId]: [{ task: lastTaskRef.current, response: fullText, timestamp: Date.now() }, ...list].slice(0, 6),
        };
      });
      setPhase('done');
      const id = activeAgentId;
      window.setTimeout(() => {
        setActiveAgentId((cur) => (cur === id ? null : cur));
        setPhase((p) => (p === 'done' ? 'idle' : p));
      }, 2200);
    }
    prevStatusRef.current = status;
  }, [status, activeAgentId, fullText]);

  const defaultRunAgentId = selectedAgentId || villagers[0]?.agent.id || null;
  const handleDockRun = () => {
    if (defaultRunAgentId) handleRun(defaultRunAgentId, taskInput);
  };

  // --- pan & zoom -----------------------------------------------------
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    setZoom((z) => clamp(z - e.deltaY * 0.0012, 0.6, 1.8));
  };

  return (
    <main className="w-screen h-screen relative overflow-hidden select-none">
      <SkyLayer isNight={isNight} weather={weather} />

      <div
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="relative"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: draggingRef.current ? 'none' : 'transform 0.05s linear',
          }}
        >
          <Ground />
          <Decor isNight={isNight} />

          {BUILDINGS.map((b) => {
            const c = buildingCenter(b);
            const p = toWorld(c.x, c.y);
            return (
              <div
                key={b.id}
                className="absolute"
                style={{ left: p.x, top: p.y, zIndex: depthOf(c.x, c.y) * 10 + 5 }}
              >
                <Building
                  def={b}
                  active={b.id === activeBuildingId}
                  selected={selectedVillager?.building.id === b.id}
                  occupied={occupiedBuildingIds.has(b.id)}
                  onClick={() => {
                    const v = villagers.find((vv) => vv.building.id === b.id);
                    if (v) setSelectedAgentId(v.agent.id);
                  }}
                />
              </div>
            );
          })}

          {villagers.map((v) => {
            const isActive = v.agent.id === activeAgentId;
            const targetGrid = isActive
              ? entranceOf(v.building.anchor, v.building.footprint)
              : houseEntrance(HOUSES[v.homeIndex]);
            const seatOffsetX = v.seatIndex * 0.4;
            const p = toWorld(targetGrid.x + seatOffsetX, targetGrid.y + 0.25);

            let vStatus: VillagerStatus;
            if (isActive) {
              vStatus = phase === 'walking' ? 'walking' : phase === 'done' ? 'done' : 'thinking';
            } else {
              vStatus = isNight ? 'sleeping' : 'idle';
            }

            return (
              <Villager
                key={v.agent.id}
                agent={v.agent}
                color={v.building.wallRight}
                accent={v.building.glow}
                icon={v.building.icon}
                x={p.x}
                y={p.y}
                status={vStatus}
                selected={selectedAgentId === v.agent.id}
                zIndex={depthOf(targetGrid.x, targetGrid.y)}
                onClick={() => setSelectedAgentId(v.agent.id)}
              />
            );
          })}
        </div>
      </div>

      <HUD
        isNight={isNight}
        onToggleNight={() => setIsNight((n) => !n)}
        weather={weather}
        onToggleWeather={() => setWeather((w) => (w === 'clear' ? 'rain' : 'clear'))}
        onZoomIn={() => setZoom((z) => clamp(z + 0.15, 0.6, 1.8))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.15, 0.6, 1.8))}
        onResetView={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        villagerCount={villagers.length}
      />

      <SidePanel
        villager={selectedVillager}
        isActive={!!selectedVillager && selectedVillager.agent.id === activeAgentId}
        status={status}
        liveText={tokens.join('')}
        activeTask={lastTaskRef.current}
        jobs={selectedVillager ? jobHistory[selectedVillager.agent.id] || [] : []}
        onClose={() => setSelectedAgentId(null)}
        onRunHere={() => selectedVillager && handleRun(selectedVillager.agent.id, taskInput)}
        taskInput={taskInput}
      />

      <TaskDock
        taskInput={taskInput}
        setTaskInput={setTaskInput}
        onRun={handleDockRun}
        activeAgentName={activeVillager?.agent.name || null}
        status={status}
        preview={tokens.join('').slice(-140)}
        disabled={!taskInput.trim()}
      />
    </main>
  );
              }  const defaultRunAgentId = selectedAgentId || villagers[0]?.agent.id || null;
  const handleDockRun = () => {
    if (defaultRunAgentId) handleRun(defaultRunAgentId, taskInput);
  };

  // --- pan & zoom -----------------------------------------------------
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    setZoom((z) => clamp(z - e.deltaY * 0.0012, 0.6, 1.8));
  };

  return (
    <main className="w-screen h-screen relative overflow-hidden select-none">
      <SkyLayer isNight={isNight} weather={weather} />

      <div
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="relative"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: draggingRef.current ? 'none' : 'transform 0.05s linear',
          }}
        >
          <Ground />
          <Decor isNight={isNight} />

          {BUILDINGS.map((b) => {
            const c = buildingCenter(b);
            const p = toWorld(c.x, c.y);
            return (
              <div
                key={b.id}
                className="absolute"
                style={{ left: p.x, top: p.y, zIndex: depthOf(c.x, c.y) * 10 + 5 }}
              >
                <Building
                  def={b}
                  active={b.id === activeBuildingId}
                  selected={selectedVillager?.building.id === b.id}
                  occupied={occupiedBuildingIds.has(b.id)}
                  onClick={() => {
                    const v = villagers.find((vv) => vv.building.id === b.id);
                    if (v) setSelectedAgentId(v.agent.id);
                  }}
                />
              </div>
            );
          })}

          {villagers.map((v) => {
            const isActive = v.agent.id === activeAgentId;
            const targetGrid = isActive
              ? entranceOf(v.building.anchor, v.building.footprint)
              : houseEntrance(HOUSES[v.homeIndex]);
            const seatOffsetX = v.seatIndex * 0.4;
            const p = toWorld(targetGrid.x + seatOffsetX, targetGrid.y + 0.25);

            let vStatus: VillagerStatus;
            if (isActive) {
              vStatus = phase === 'walking' ? 'walking' : phase === 'done' ? 'done' : 'thinking';
            } else {
              vStatus = isNight ? 'sleeping' : 'idle';
            }

            return (
              <Villager
                key={v.agent.id}
                agent={v.agent}
                color={v.building.wallRight}
                accent={v.building.glow}
                icon={v.building.icon}
                x={p.x}
                y={p.y}
                status={vStatus}
                selected={selectedAgentId === v.agent.id}
                zIndex={depthOf(targetGrid.x, targetGrid.y)}
                onClick={() => setSelectedAgentId(v.agent.id)}
              />
            );
          })}
        </div>
      </div>

      <HUD
        isNight={isNight}
        onToggleNight={() => setIsNight((n) => !n)}
        weather={weather}
        onToggleWeather={() => setWeather((w) => (w === 'clear' ? 'rain' : 'clear'))}
        onZoomIn={() => setZoom((z) => clamp(z + 0.15, 0.6, 1.8))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.15, 0.6, 1.8))}
        onResetView={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        villagerCount={villagers.length}
      />

      <SidePanel
        villager={selectedVillager}
        isActive={!!selectedVillager && selectedVillager.agent.id === activeAgentId}
        status={status}
        liveText={tokens.join('')}
        activeTask={lastTaskRef.current}
        jobs={selectedVillager ? jobHistory[selectedVillager.agent.id] || [] : []}
        onClose={() => setSelectedAgentId(null)}
        onRunHere={() => selectedVillager && handleRun(selectedVillager.agent.id, taskInput)}
        taskInput={taskInput}
      />

      <TaskDock
        taskInput={taskInput}
        setTaskInput={setTaskInput}
        onRun={handleDockRun}
        activeAgentName={activeVillager?.agent.name || null}
        status={status}
        preview={tokens.join('').slice(-140)}
        disabled={!taskInput.trim()}
      />
    </main>
  );
          }  const defaultRunAgentId = selectedAgentId || villagers[0]?.agent.id || null;
  const handleDockRun = () => {
    if (defaultRunAgentId) handleRun(defaultRunAgentId, taskInput);
  };

  // --- pan & zoom -----------------------------------------------------
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    setZoom((z) => clamp(z - e.deltaY * 0.0012, 0.6, 1.8));
  };

  return (
    <main className="w-screen h-screen relative overflow-hidden select-none">
      <SkyLayer isNight={isNight} weather={weather} />

      <div
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="relative"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: draggingRef.current ? 'none' : 'transform 0.05s linear',
          }}
        >
          <Ground />
          <Decor isNight={isNight} />

          {BUILDINGS.map((b) => {
            const c = buildingCenter(b);
            const p = toWorld(c.x, c.y);
            return (
              <div
                key={b.id}
                className="absolute"
                style={{ left: p.x, top: p.y, zIndex: depthOf(c.x, c.y) * 10 + 5 }}
              >
                <Building
                  def={b}
                  active={b.id === activeBuildingId}
                  selected={selectedVillager?.building.id === b.id}
                  occupied={occupiedBuildingIds.has(b.id)}
                  onClick={() => {
                    const v = villagers.find((vv) => vv.building.id === b.id);
                    if (v) setSelectedAgentId(v.agent.id);
                  }}
                />
              </div>
            );
          })}

          {villagers.map((v) => {
            const isActive = v.agent.id === activeAgentId;
            const targetGrid = isActive
              ? entranceOf(v.building.anchor, v.building.footprint)
              : houseEntrance(HOUSES[v.homeIndex]);
            const seatOffsetX = v.seatIndex * 0.4;
            const p = toWorld(targetGrid.x + seatOffsetX, targetGrid.y + 0.25);

            let vStatus: VillagerStatus;
            if (isActive) {
              vStatus = phase === 'walking' ? 'walking' : phase === 'done' ? 'done' : 'thinking';
            } else {
              vStatus = isNight ? 'sleeping' : 'idle';
            }

            return (
              <Villager
                key={v.agent.id}
                agent={v.agent}
                color={v.building.wallRight}
                accent={v.building.glow}
                icon={v.building.icon}
                x={p.x}
                y={p.y}
                status={vStatus}
                selected={selectedAgentId === v.agent.id}
                zIndex={depthOf(targetGrid.x, targetGrid.y)}
                onClick={() => setSelectedAgentId(v.agent.id)}
              />
            );
          })}
        </div>
      </div>

      <HUD
        isNight={isNight}
        onToggleNight={() => setIsNight((n) => !n)}
        weather={weather}
        onToggleWeather={() => setWeather((w) => (w === 'clear' ? 'rain' : 'clear'))}
        onZoomIn={() => setZoom((z) => clamp(z + 0.15, 0.6, 1.8))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.15, 0.6, 1.8))}
        onResetView={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        villagerCount={villagers.length}
      />

      <SidePanel
        villager={selectedVillager}
        isActive={!!selectedVillager && selectedVillager.agent.id === activeAgentId}
        status={status}
        liveText={tokens.join('')}
        activeTask={lastTaskRef.current}
        jobs={selectedVillager ? jobHistory[selectedVillager.agent.id] || [] : []}
        onClose={() => setSelectedAgentId(null)}
        onRunHere={() => selectedVillager && handleRun(selectedVillager.agent.id, taskInput)}
        taskInput={taskInput}
      />

      <TaskDock
        taskInput={taskInput}
        setTaskInput={setTaskInput}
        onRun={handleDockRun}
        activeAgentName={activeVillager?.agent.name || null}
        status={status}
        preview={tokens.join('').slice(-140)}
        disabled={!taskInput.trim()}
      />
    </main>
  );
}
