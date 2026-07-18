'use client';

export default function SkyLayer({ isNight, weather }: { isNight: boolean; weather: 'clear' | 'rain' }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isNight
            ? 'linear-gradient(180deg, #1B2440 0%, #2B3A5C 45%, #3F4E6E 100%)'
            : 'linear-gradient(180deg, #BEE3E8 0%, #DCEFD9 55%, #EAF3D8 100%)',
        }}
      />

      {/* stars */}
      {isNight && (
        <div className="absolute inset-0 opacity-80">
          {Array.from({ length: 40 }).map((_, i) => {
            const left = (i * 47) % 100;
            const top = (i * 31) % 60;
            const delay = (i % 7) * 0.4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: 2,
                  height: 2,
                  animation: `twinkle 3s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* sun / moon */}
      <div
        className="absolute rounded-full"
        style={{
          right: '12%',
          top: isNight ? '10%' : '8%',
          width: isNight ? 46 : 64,
          height: isNight ? 46 : 64,
          background: isNight ? '#EDEBF5' : '#FCE7A6',
          boxShadow: isNight ? '0 0 30px 10px rgba(237,235,245,0.4)' : '0 0 50px 16px rgba(252,231,166,0.5)',
        }}
      />

      {/* clouds */}
      {[
        { top: '14%', size: 1, dur: 60 },
        { top: '24%', size: 0.7, dur: 80 },
        { top: '8%', size: 0.5, dur: 50 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: '-20%',
            animation: `driftCloud ${c.dur}s linear infinite`,
            opacity: isNight ? 0.25 : 0.85,
          }}
        >
          <svg width={120 * c.size} height={40 * c.size} viewBox="0 0 120 40">
            <ellipse cx="30" cy="24" rx="26" ry="14" fill="#FFFFFF" />
            <ellipse cx="60" cy="18" rx="30" ry="16" fill="#FFFFFF" />
            <ellipse cx="90" cy="26" rx="22" ry="12" fill="#FFFFFF" />
          </svg>
        </div>
      ))}

      {/* rain */}
      {weather === 'rain' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => {
            const left = (i * 13) % 100;
            const dur = 0.6 + (i % 5) * 0.1;
            const delay = (i % 10) * 0.15;
            return (
              <div
                key={i}
                className="absolute w-px h-4 bg-white/40"
                style={{ left: `${left}%`, top: '-5%', animation: `rainDrop ${dur}s linear ${delay}s infinite` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
