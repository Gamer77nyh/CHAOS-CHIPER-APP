
import React, { useEffect, useState, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup
} from "react-simple-maps";

const geoUrl = "./world-atlas.json";

type ViewMode = 'GLOBAL' | 'ABUJA' | 'KANO';

interface HVT {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'DATA_NODE' | 'POWER_GRID' | 'SATELLITE_RELAY' | 'COMM_HUB';
  status: 'COMPROMISED' | 'SCANNING' | 'ACTIVE';
}

const GlobalThreatMap: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('GLOBAL');
  const [mapConfig, setMapConfig] = useState({ center: [0, 0] as [number, number], zoom: 1 });
  const [activePulses, setActivePulses] = useState<{ id: number; coordinates: [number, number]; city: string }[]>([]);
  const pulseIdCounter = useRef(0);

  const globalTargets = [
    { name: 'Silicon Valley', coordinates: [-122.4194, 37.7749] },
    { name: 'New York', coordinates: [-74.0060, 40.7128] },
    { name: 'London', coordinates: [-0.1278, 51.5074] },
    { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
    { name: 'Singapore', coordinates: [103.8198, 1.3521] },
    { name: 'Lagos', coordinates: [3.3792, 6.5244] },
  ];

  const abujaHVTs: HVT[] = [
    { id: 'ABJ-01', name: 'National Data Centre', coordinates: [7.489, 9.052], type: 'DATA_NODE', status: 'COMPROMISED' },
    { id: 'ABJ-02', name: 'Central Bank Node', coordinates: [7.495, 9.058], type: 'DATA_NODE', status: 'ACTIVE' },
    { id: 'ABJ-03', name: 'Satellite Relay Alpha', coordinates: [7.442, 8.991], type: 'SATELLITE_RELAY', status: 'SCANNING' },
    { id: 'ABJ-04', name: 'Power Grid Nexus', coordinates: [7.521, 9.071], type: 'POWER_GRID', status: 'ACTIVE' },
  ];

  const kanoHVTs: HVT[] = [
    { id: 'KANO-01', name: 'Industrial Grid Alpha', coordinates: [8.551, 12.022], type: 'POWER_GRID', status: 'COMPROMISED' },
    { id: 'KANO-02', name: 'Fiber Trunk 01', coordinates: [8.512, 11.995], type: 'DATA_NODE', status: 'ACTIVE' },
    { id: 'KANO-03', name: 'Telecom Hub', coordinates: [8.591, 12.001], type: 'COMM_HUB', status: 'SCANNING' },
  ];

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'GLOBAL') {
      setMapConfig({ center: [10, 0], zoom: 1 });
    } else if (mode === 'ABUJA') {
      setMapConfig({ center: [7.4951, 9.0578], zoom: 60 });
    } else if (mode === 'KANO') {
      setMapConfig({ center: [8.5920, 12.0022], zoom: 60 });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const targets = viewMode === 'GLOBAL' ? globalTargets : (viewMode === 'ABUJA' ? abujaHVTs : kanoHVTs);
      const target = targets[Math.floor(Math.random() * targets.length)];
      const newPulse = {
        id: pulseIdCounter.current++,
        coordinates: target.coordinates as [number, number],
        city: target.name
      };
      setActivePulses(prev => [...prev.slice(-5), newPulse]);
    }, 4000);
    return () => clearInterval(interval);
  }, [viewMode]);

  return (
    <div className="h-full w-full bg-black border border-green-500/20 relative overflow-hidden flex font-orbitron text-green-500">
      
      {/* Sidebar Switcher */}
      <div className="w-64 border-r border-green-500/20 bg-black/80 backdrop-blur-md p-6 flex flex-col gap-6 z-20">
        <div>
          <h2 className="text-[10px] font-black tracking-[0.3em] text-green-900 mb-4 uppercase">Target_Selection</h2>
          <div className="space-y-2">
            {(['GLOBAL', 'ABUJA', 'KANO'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => handleViewChange(mode)}
                className={`w-full py-3 px-4 text-left text-[10px] font-bold tracking-widest border transition-all ${
                  viewMode === mode 
                    ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                    : 'border-green-500/10 text-green-900 hover:border-green-500/40 hover:text-green-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${viewMode === mode ? 'bg-green-400 animate-pulse' : 'bg-green-900'}`}></div>
                  {mode === 'GLOBAL' ? 'WORLD_VIEW' : `SURGICAL_${mode}`}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-green-900 mb-4 uppercase">Tactical_Intel</h2>
          <div className="space-y-4">
            {(viewMode === 'ABUJA' ? abujaHVTs : (viewMode === 'KANO' ? kanoHVTs : [])).map(hvt => (
              <div key={hvt.id} className="border-l-2 border-green-500/20 pl-3 py-1">
                <div className="text-[9px] font-bold text-green-400">{hvt.name}</div>
                <div className="flex justify-between text-[7px] mt-1">
                  <span className="text-green-900">{hvt.type}</span>
                  <span className={hvt.status === 'COMPROMISED' ? 'text-red-600' : (hvt.status === 'SCANNING' ? 'text-yellow-500 animate-pulse' : 'text-green-600')}>{hvt.status}</span>
                </div>
              </div>
            ))}
            {viewMode === 'GLOBAL' && (
              <div className="text-[8px] text-green-700 leading-relaxed italic">
                "Pupil, the global grid is under our control. Select a surgical target in Nigeria to focus our data siphoning operations."
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-green-500/10">
          <div className="flex justify-between text-[8px] font-bold mb-2">
            <span className="text-green-900">UP_LINK:</span>
            <span className="text-green-500">S_RELAY_9</span>
          </div>
          <div className="w-full h-1 bg-green-900/20"><div className="h-full bg-green-500 w-[72%] shadow-[0_0_10px_#22c55e]"></div></div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative flex flex-col p-6">
        <div className="flex justify-between items-start mb-6 z-10">
          <div>
            <h1 className="text-2xl font-black text-green-500 flex items-center gap-3 tracking-tighter uppercase">
              <i className="fas fa-globe"></i> {viewMode === 'GLOBAL' ? 'GLOBAL THREAT MAP' : `SURGICAL_FOCUS: ${viewMode}`}
            </h1>
            <div className="text-[10px] text-green-900 font-bold tracking-widest mt-1">
              {viewMode === 'GLOBAL' ? 'GEO_SYNC: ACTIVE' : `LOCAL_CELL: ${viewMode}_METRO_LINK`}
            </div>
          </div>
          
          <div className="bg-black/80 border border-green-500/20 px-6 py-3 backdrop-blur-md">
            <span className="text-[8px] text-green-900 block font-bold uppercase tracking-[0.2em] mb-1">Incursion_Alerts</span>
            <div className="text-lg font-bold text-red-600 animate-pulse flex items-center gap-3">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              {activePulses.length} ACTIVE_STREAMS
            </div>
          </div>
        </div>

        <div className="flex-1 relative border border-green-500/10 bg-green-500/[0.02] rounded-sm overflow-hidden flex items-center justify-center">
          <ComposableMap
            projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup 
              center={mapConfig.center} 
              zoom={mapConfig.zoom}
              onMoveEnd={(pos) => setMapConfig({ center: pos.coordinates, zoom: pos.zoom })}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#051505"
                      stroke="#00ff41"
                      strokeWidth={viewMode === 'GLOBAL' ? 0.5 : 0.05}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#0a2a0a", outline: "none" },
                        pressed: { fill: "#0a2a0a", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Network Lines (Global only) */}
              {viewMode === 'GLOBAL' && (
                <>
                  <Line from={[-122.4194, 37.7749]} to={[139.6917, 35.6895]} stroke="#00ff41" strokeWidth={0.5} strokeDasharray="4 2" opacity={0.2} />
                  <Line from={[139.6917, 35.6895]} to={[103.8198, 1.3521]} stroke="#00ff41" strokeWidth={0.5} strokeDasharray="4 2" opacity={0.2} />
                  <Line from={[-74.0060, 40.7128]} to={[-0.1278, 51.5074]} stroke="#00ff41" strokeWidth={0.5} strokeDasharray="4 2" opacity={0.2} />
                  <Line from={[7.4951, 9.0578]} to={[-0.1278, 51.5074]} stroke="#00ff41" strokeWidth={0.5} strokeDasharray="4 2" opacity={0.4} />
                </>
              )}

              {/* HVT Markers */}
              {(viewMode === 'ABUJA' ? abujaHVTs : (viewMode === 'KANO' ? kanoHVTs : [])).map(hvt => (
                <Marker key={hvt.id} coordinates={hvt.coordinates}>
                  <rect width={1} height={1} x={-0.5} y={-0.5} fill={hvt.status === 'COMPROMISED' ? '#ff0000' : '#00ff41'} opacity={0.8} />
                  <text
                    textAnchor="middle"
                    y={-1.5}
                    style={{ fontFamily: "monospace", fill: "#00ff41", fontSize: "0.4px", fontWeight: "bold" }}
                  >
                    {hvt.name}
                  </text>
                </Marker>
              ))}

              {/* Dynamic Pulses */}
              {activePulses.map((pulse) => (
                <Marker key={pulse.id} coordinates={pulse.coordinates}>
                  <circle r={viewMode === 'GLOBAL' ? 4 : 0.4} fill="#ff0000" className="animate-ping opacity-75" />
                  <circle r={viewMode === 'GLOBAL' ? 2 : 0.2} fill="#ff0000" />
                  {viewMode === 'GLOBAL' && (
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{ fontFamily: "monospace", fill: "#00ff41", fontSize: "6px", fontWeight: "bold" }}
                    >
                      {pulse.city}
                    </text>
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* HUD Overlays */}
          <div className="absolute top-4 left-4 font-mono text-[8px] text-green-500 space-y-1 bg-black/60 p-3 backdrop-blur-sm border border-green-500/20 z-10">
            <div className="flex justify-between gap-6 border-b border-green-500/20 pb-1 mb-1">
              <span className="text-green-900 font-bold uppercase">Telemetry_Stats</span>
              <span className="text-green-500 font-bold">LIVE</span>
            </div>
            <div className="flex justify-between gap-6"><span>LAT_LONG:</span> <span>[{mapConfig.center[1].toFixed(4)}, {mapConfig.center[0].toFixed(4)}]</span></div>
            <div className="flex justify-between gap-6"><span>ZOOM_LVL:</span> <span>X{mapConfig.zoom.toFixed(1)}</span></div>
            <div className="flex justify-between gap-6"><span>ENCRYPTION:</span> <span className="text-cyan-500">SHA-512_V3</span></div>
          </div>
          
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 z-10">
            <div className="bg-black/80 border border-green-500/20 p-4 backdrop-blur-md min-w-[200px]">
              <div className="text-[9px] text-green-900 font-black mb-2 uppercase tracking-widest border-b border-green-900/30 pb-2">Active_Incursion_Log</div>
              <div className="text-[7px] text-green-500 font-mono space-y-1 h-24 overflow-hidden">
                {activePulses.slice().reverse().map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="text-red-600 animate-pulse">!</span>
                    <span>TARGET_LOCKED: {p.city.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-6">
          <div className="flex-1 border border-green-900/20 p-4 bg-green-900/5">
            <h3 className="text-[10px] font-bold text-green-700 mb-2 uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-terminal"></i> OPERATIONAL_LOG
            </h3>
            <p className="text-[9px] text-green-500 leading-tight">
              {viewMode === 'GLOBAL' 
                ? "World view established. The node network is propagating through trans-oceanic links. Select a surgical target to execute precise data siphoning."
                : `Surgical focus initiated on ${viewMode}. Targeting local infrastructure and high-value data nodes. Neural link optimized for local cell operations.`}
            </p>
          </div>
          <div className="w-64 border border-red-900/20 p-4 bg-red-950/5 flex items-center justify-center">
            <button className="w-full h-full border border-red-600 text-[10px] font-bold text-red-500 hover:bg-red-600 hover:text-white transition-all tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(255,0,0,0.1)]">
              {viewMode === 'GLOBAL' ? 'Global_Override' : `Purge_${viewMode}_Nodes`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalThreatMap;
