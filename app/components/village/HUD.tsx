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
  isMobile?: boolean;
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
  isMobile,
}: HUDProps) {
  return (
    <div className="safe-top safe-x absolute top-0 left-0 right-0 z-30 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-lg px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-sm max-w-[62vw] sm:max-w-none">
        <span className="text-xl sm:text-2xl shrink-0">🏘️</span>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-display text-sm sm:text-base text-[#3A2A18] truncate">Inplug Village</span>
          {!isMobile && (
            <span className="text-[11px] text-[#8B5E3C]">
              {villagerCount} villager{villagerCount === 1 ? '' : 's'} at work
            </span>
          )}
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 flex-wrap justify-end">
        <div className="flex items-center gap-1 rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-lg px-1.5 py-1.5 sm:px-2 sm:py-2">
          <button
            onClick={onToggleNight}
            title="Toggle day / night"
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl hover:bg-[#E8DCC4] active:bg-[#E8DCC4] flex items-center justify-center text-lg transition-colors"
          >
            {isNight ? '🌙' : '☀️'}
          </button>
          <button
            onClick={onToggleWeather}
            title="Toggle weather"
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl hover:bg-[#E8DCC4] active:bg-[#E8DCC4] flex items-center justify-center text-lg transition-colors"
          >
            {weather === 'rain' ? '🌧️' : '⛅'}
          </button>
          <div className="w-px h-6 bg-[#C9BC9C] mx-0.5 sm:mx-1" />
          <button
            onClick={onZoomOut}
            title="Zoom out"
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl hover:bg-[#E8DCC4] active:bg-[#E8DCC4] flex items-center justify-center text-sm font-bold text-[#3A2A18]"
          >
            −
          </button>
          <button
            onClick={onResetView}
            title="Reset view"
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl hover:bg-[#E8DCC4] active:bg-[#E8DCC4] flex items-center justify-center text-xs text-[#3A2A18]"
          >
            ⤾
          </button>
          <button
            onClick={onZoomIn}
            title="Zoom in"
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl hover:bg-[#E8DCC4] active:bg-[#E8DCC4] flex items-center justify-center text-sm font-bold text-[#3A2A18]"
          >
            +
          </button>
        </div>

        <Link
          href="/workflows"
          className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm text-[#3A2A18] hover:bg-[#E8DCC4] transition-colors font-medium"
        >
          🪧 <span className="hidden sm:inline">Workflow Trail</span>
        </Link>
      </div>
    </div>
  );
}
