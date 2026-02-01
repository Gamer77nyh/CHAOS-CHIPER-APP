
import React, { useEffect, useState, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const GlobalThreatMap: React.FC = () => {
  const [activePulses, setActivePulses] = useState<{ id: number; coordinates: [number, number]; city: string }[]>([]);
  const pulseIdCounter = useRef(0);

  const targetCities = [
    { name: 'Silicon Valley', coordinates: [-122.4194, 37.7749] },
    { name: 'New York', coordinates: [-74.0060, 40.7128] },
    { name: 'London', coordinates: [-0.1278, 51.5074] },
    { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
    { name: 'Moscow', coordinates: [37.6173, 55.7558] },
    { name: 'Sydney', coordinates: [151.2093, -33.8688] },
    { name: 'Frankfurt', coordinates: [8.6821, 50.1109] },
    { name: 'Singapore', coordinates: [103.8198, 1.3521] },
    { name: 'São Paulo', coordinates: [-46.6333, -23.5505] },
    { name: 'Beijing', coordinates: [116.4074, 39.9042] },
    { name: 'Dubai', coordinates: [55.2708, 25.2048] },
    { name: 'Cape Town', coordinates: [18.4241, -33.9249] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const city = targetCities[Math.floor(Math.random() * targetCities.length)];
      const newPulse = {
        id: pulseIdCounter.current++,
        coordinates: city.coordinates as [number, number],
        city: city.name
      };
      
      setActivePulses(prev => [...prev.slice(-8), newPulse]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-black border border-green-500/20 relative overflow-hidden flex flex-col p-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-green-500 flex items-center gap-3 tracking-tighter uppercase">
            <i className="fas fa-globe"></i> GLOBAL THREAT MAP
          </h1>
          <div className="text-[10px] text-green-900 font-bold tracking-widest mt-1">GEO_SYNC: ACTIVE (S_RELAY_9)</div>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-950/20 border border-green-500/20 px-4 py-2">
            <span className="text-[8px] text-green-900 block font-bold">LIVE_INCURSIONS</span>
            <span className="text-lg font-bold text-red-600 animate-pulse">{activePulses.length}</span>
          </div>
          <div className="bg-green-950/20 border border-green-500/20 px-4 py-2">
            <span className="text-[8px] text-green-900 block font-bold">NODE_DENSITY</span>
            <span className="text-lg font-bold text-green-500">GLOBAL_SATURATION</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative border border-green-500/10 bg-green-500/[0.02] rounded-sm overflow-hidden flex items-center justify-center">
        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#051505"
                  stroke="#00ff41"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#0a2a0a", outline: "none" },
                    pressed: { fill: "#0a2a0a", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Network Lines */}
          <Line
            from={[-122.4194, 37.7749]} // SF
            to={[139.6917, 35.6895]}   // Tokyo
            stroke="#00ff41"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            opacity={0.2}
          />
          <Line
            from={[139.6917, 35.6895]}  // Tokyo
            to={[103.8198, 1.3521]}    // Singapore
            stroke="#00ff41"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            opacity={0.2}
          />
          <Line
            from={[-74.0060, 40.7128]}  // NY
            to={[-0.1278, 51.5074]}     // London
            stroke="#00ff41"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            opacity={0.2}
          />

          {activePulses.map((pulse) => (
            <Marker key={pulse.id} coordinates={pulse.coordinates}>
              <circle r={4} fill="#ff0000" className="animate-ping opacity-75" />
              <circle r={2} fill="#ff0000" />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontFamily: "monospace", fill: "#00ff41", fontSize: "6px", fontWeight: "bold" }}
              >
                {pulse.city}
              </text>
            </Marker>
          ))}
        </ComposableMap>

        {/* HUD Overlays */}
        <div className="absolute top-4 left-4 font-mono text-[8px] text-green-500 space-y-1 bg-black/60 p-2 backdrop-blur-sm border border-green-500/20">
          <div className="flex justify-between gap-4"><span>COORDS:</span> <span>[LAT_LONG_STREAM]</span></div>
          <div className="flex justify-between gap-4"><span>PROTO:</span> <span>SATELLITE_MESH</span></div>
          <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-red-600">INCURSION_READY</span></div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-black/60 border border-green-500/20 p-2 backdrop-blur-md">
            <div className="text-[8px] text-green-900 font-bold mb-1 uppercase tracking-widest border-b border-green-900/30 pb-1">Incursion_Log</div>
            <div className="text-[7px] text-green-500 font-mono space-y-1 h-12 overflow-hidden">
              {activePulses.slice().reverse().map(p => (
                <div key={p.id}>{">"} TARGET_ACQUIRED: {p.city.toUpperCase()}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="border border-green-900/20 p-4 bg-green-900/5">
          <h3 className="text-[10px] font-bold text-green-700 mb-2 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-satellite"></i> RELAY_ANALYSIS
          </h3>
          <p className="text-[9px] text-green-500 leading-tight">"Pupil, observe the real-time geographic distribution. Our malware is currently propagating through the undersea fiber links. Geography is irrelevant in the digital void."</p>
        </div>
        <div className="border border-green-900/20 p-4 bg-green-900/5 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[8px] text-green-900 font-bold uppercase">Satellite_Coverage</span>
            <span className="text-xs font-bold text-green-500">99.9%</span>
          </div>
          <div className="w-full h-1 bg-green-900/30"><div className="h-full bg-green-500 w-[99.9%] shadow-[0_0_10px_#00ff41]"></div></div>
        </div>
        <div className="border border-red-900/20 p-4 bg-red-950/5 flex items-center justify-center">
          <button className="w-full py-2 border border-red-600 text-[10px] font-bold text-red-500 hover:bg-red-600 hover:text-white transition-all tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(255,0,0,0.1)]">
            Execute_Global_Override
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalThreatMap;
