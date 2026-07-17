'use client';

import { useState } from 'react';

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col bg-bg p-4 relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center z-10">
        <h1 className="text-2xl pixel-text text-accent">PixelHQ AI</h1>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>⚡ 4 Agents Active</span>
          <span>🌧️ Rain</span>
        </div>
      </header>

      {/* Office Canvas */}
      <div className="flex-1 relative mt-4 border-2 border-panel bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl">
        {/* Background Room Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
        </div>

        {/* Rooms */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 h-full w-full">
          {[
            { name: 'CEO Office', icon: '🏢' },
            { name: 'Developer Room', icon: '💻' },
            { name: 'Creative Studio', icon: '🎨' },
            { name: 'Research Library', icon: '📚' },
            { name: 'Analytics Room', icon: '📊' },
            { name: 'Brain Core', icon: '🧠' },
          ].map((room, idx) => (
            <div key={idx} className="bg-panel/50 border border-panel rounded-lg flex flex-col items-center justify-center relative transition-all hover:border-accent/50">
              <span className="text-4xl mb-2">{room.icon}</span>
              <span className="pixel-text text-xs text-gray-400">{room.name}</span>
              
              {/* Pixel Worker inside room */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pixel-worker" />
              
              {/* Rain drops (CSS animation) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-px h-4 bg-blue-500/30 absolute top-0 left-10 animate-[drop_2s_linear_infinite]" />
                <div className="w-px h-4 bg-blue-500/30 absolute top-0 left-20 animate-[drop_2.5s_linear_infinite]" />
                <div className="w-px h-4 bg-blue-500/30 absolute top-0 left-30 animate-[drop_1.8s_linear_infinite]" />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Notifications (Pixel Mailbox) */}
        <div className="absolute bottom-4 right-4 bg-panel p-2 rounded-lg border border-accent/30 flex items-center gap-2 cursor-pointer hover:bg-panel/80">
          <span className="text-lg">📨</span>
          <span className="text-xs pixel-text text-accent">3</span>
        </div>
      </div>
    </main>
  );
}

/* Add drop animation to globals.css or inline style */
// @keyframes drop { 0% { transform: translateY(-10px); } 100% { transform: translateY(400px); } }
