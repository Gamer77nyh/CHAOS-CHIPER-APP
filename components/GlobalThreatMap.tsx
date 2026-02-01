
import React, { useEffect, useState, useRef } from 'react';

const GlobalThreatMap: React.FC = () => {
  const [activePulses, setActivePulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const pulseIdCounter = useRef(0);

  // High-value targets (approximate coordinates for SVG viewbox 800x400)
  const targets = [
    { name: 'Silicon Valley', x: 120, y: 150 },
    { name: 'New York', x: 220, y: 145 },
    { name: 'London', x: 385, y: 120 },
    { name: 'Tokyo', x: 680, y: 160 },
    { name: 'Moscow', x: 480, y: 110 },
    { name: 'Sydney', x: 690, y: 320 },
    { name: 'Frankfurt', x: 410, y: 130 },
    { name: 'Singapore', x: 620, y: 240 },
    { name: 'São Paulo', x: 280, y: 290 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const target = targets[Math.floor(Math.random() * targets.length)];
      const newPulse = {
        id: pulseIdCounter.current++,
        x: target.x + (Math.random() * 10 - 5),
        y: target.y + (Math.random() * 10 - 5),
      };
      
      setActivePulses(prev => [...prev.slice(-10), newPulse]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-black border border-green-500/20 relative overflow-hidden flex flex-col p-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-green-500 flex items-center gap-3 tracking-tighter uppercase">
            <i className="fas fa-globe"></i> GLOBAL THREAT MAP
          </h1>
          <div className="text-[10px] text-green-900 font-bold tracking-widest mt-1">SATELLITE_LINK: ESTABLISHED (S_RELAY_9)</div>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-950/20 border border-green-500/20 px-4 py-2">
            <span className="text-[8px] text-green-900 block font-bold">ACTIVE_INCURSIONS</span>
            <span className="text-lg font-bold text-red-600 animate-pulse">{activePulses.length}</span>
          </div>
          <div className="bg-green-950/20 border border-green-500/20 px-4 py-2">
            <span className="text-[8px] text-green-900 block font-bold">NODE_DENSITY</span>
            <span className="text-lg font-bold text-green-500">OPTIMAL</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative border border-green-500/10 bg-green-500/[0.02] rounded-sm overflow-hidden">
        {/* Simplified World Map SVG */}
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 fill-green-900/40 stroke-green-500/20">
          <path d="M150,120 L160,110 L180,115 L190,130 L185,150 L170,160 L150,155 Z M400,100 L420,90 L450,95 L460,110 L440,130 L410,125 Z M650,150 L670,140 L700,145 L710,165 L690,180 L660,175 Z M250,250 L270,240 L300,245 L310,270 L290,300 L260,290 Z M650,300 L670,290 L700,300 L690,330 L660,320 Z" />
          {/* Add more path data for a better map representation if needed, using simple placeholders for now */}
          <rect x="50" y="80" width="200" height="100" rx="20" fill="currentColor" opacity="0.3" />
          <rect x="350" y="70" width="150" height="120" rx="30" fill="currentColor" opacity="0.3" />
          <rect x="600" y="100" width="120" height="150" rx="20" fill="currentColor" opacity="0.3" />
          <rect x="200" y="220" width="120" height="140" rx="40" fill="currentColor" opacity="0.3" />
          <rect x="620" y="280" width="100" height="80" rx="20" fill="currentColor" opacity="0.3" />
          
          {/* Static Node Network Lines */}
          <g className="stroke-green-500/10" strokeWidth="0.5">
            <line x1="120" y1="150" x2="385" y2="120" />
            <line x1="385" y1="120" x2="680" y2="160" />
            <line x1="680" y1="160" x2="620" y2="240" />
            <line x1="620" y1="240" x2="280" y2="290" />
            <line x1="280" y1="290" x2="120" y2="150" />
          </g>
        </svg>

        {/* Dynamic Pulses */}
        {activePulses.map(pulse => (
          <div 
            key={pulse.id}
            className="absolute pointer-events-none"
            style={{ 
              left: `${(pulse.x / 800) * 100}%`, 
              top: `${(pulse.y / 400) * 100}%` 
            }}
          >
            <div className="w-4 h-4 -ml-2 -mt-2 bg-red-600 rounded-full animate-ping opacity-75"></div>
            <div className="w-2 h-2 -ml-1 -mt-1 bg-red-500 rounded-full shadow-[0_0_10px_#ff0000]"></div>
          </div>
        ))}

        {/* HUD Overlays */}
        <div className="absolute top-4 left-4 font-mono text-[8px] text-green-500 space-y-1 bg-black/40 p-2 backdrop-blur-sm">
          <div>SCANNING_COORD: [37.7749, -122.4194]</div>
          <div>ENCRYPTION: AES-256-GCM</div>
          <div>THREAT_LEVEL: OMEGA</div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-black/60 border border-green-500/20 p-2 backdrop-blur-md">
            <div className="text-[8px] text-green-900 font-bold mb-1 uppercase tracking-widest">Incursion_Feed</div>
            <div className="text-[7px] text-green-500 font-mono space-y-1">
              <div>> SIPHON_START: TOKYO_CENTRAL</div>
              <div>> BYPASS_SUCCESS: NY_FED_RESERVE</div>
              <div>> PIVOT_ACTIVE: LONDON_BRIDGE</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="border border-green-900/20 p-4 bg-green-900/5">
          <h3 className="text-[10px] font-bold text-green-700 mb-2 uppercase tracking-widest">S_RELAY_LINK</h3>
          <p className="text-[9px] text-green-500 leading-tight">"Pupil, notice the pulse in London. That's the result of the Shadow Step pivot we executed earlier. The global grid is now our nervous system."</p>
        </div>
        <div className="border border-green-900/20 p-4 bg-green-900/5 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[8px] text-green-900 font-bold">NETWORK_REACH</span>
            <span className="text-xs font-bold text-green-500">98.4%</span>
          </div>
          <div className="w-full h-1 bg-green-900/30"><div className="h-full bg-green-500 w-[98.4%]"></div></div>
        </div>
        <div className="border border-red-900/20 p-4 bg-red-950/5 flex items-center justify-center">
          <button className="px-6 py-2 border border-red-600 text-[10px] font-bold text-red-500 hover:bg-red-600 hover:text-white transition-all tracking-[0.3em] uppercase">
            Initialize_Global_Leak
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalThreatMap;
