'use client';

import Link from 'next/link';

interface HUDProps {
  isNight: boolean;
  onToggleNight: () => void;
  weather: 'clear' | 'rain';
  onToggleWeather: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  villagerCount: number;
}

export default function HUD({
  isNight,
  onToggleNight,
  weather,
  onToggleWeather,
  onZoomIn,
  onZoomOut,
  onResetView,
  villagerCount,
}: HUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex items-start justify-between gap-3 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-lg px-4 py-2.5 backdrop-blur-sm">
        <span className="text-2xl">🏘️</span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-base text-[#3A2A18]">Inplug Village</span>
          <span className="text-[11px] text-[#8B5E3C]">{villagerCount} villager{villagerCount === 1 ? '' : 's'} at work</span>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-lg px-2 py-2">
          <button
            onClick={onToggleNight}
            title="Toggle day / night"
            className="w-9 h-9 rounded-xl hover:bg-[#E8DCC4] flex items-center justify-center text-lg transition-colors"
          >
            {isNight ? '🌙' : '☀️'}
          </button>
          <button
            onClick={onToggleWeather}
            title="Toggle weather"
            className="w-9 h-9 rounded-xl hover:bg-[#E8DCC4] flex items-center justify-center text-lg transition-colors"
          >
            {weather === 'rain' ? '🌧️' : '⛅'}
          </button>
          <div className="w-px h-6 bg-[#C9BC9C] mx-1" />
          <button onClick={onZoomOut} title="Zoom out" className="w-9 h-9 rounded-xl hover:bg-[#E8DCC4] flex items-center justify-center text-sm font-bold text-[#3A2A18]">
            −
          </button>
          <button onClick={onResetView} title="Reset view" className="w-9 h-9 rounded-xl hover:bg-[#E8DCC4] flex items-center justify-center text-xs text-[#3A2A18]">
            ⤾
          </button>
          <button onClick={onZoomIn} title="Zoom in" className="w-9 h-9 rounded-xl hover:bg-[#E8DCC4] flex items-center justify-center text-sm font-bold text-[#3A2A18]">
            +
          </button>
        </div>

        <Link
          href="/workflows"
          className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-lg px-4 py-2.5 text-sm text-[#3A2A18] hover:bg-[#E8DCC4] transition-colors font-medium"
        >
          🪧 Workflow Trail
        </Link>
      </div>
    </div>
  );
}
