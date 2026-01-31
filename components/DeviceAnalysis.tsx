
import React, { useState, useEffect, useMemo, useRef } from 'react';

const DeviceAnalysis: React.FC = () => {
  // Power Transition State
  const [powerTransition, setPowerTransition] = useState<'NONE' | 'SHUTDOWN' | 'RESTART' | 'SLEEP' | 'HIBERNATE'>('NONE');
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  
  // Initialize with robust defaults
  const [metrics, setMetrics] = useState<any>({
    cpu: { total: 0, perCore: [0, 0, 0, 0], temp: 38, freq: 2.8, fanSpeed: 2100, load: 15 },
    ram: { used: 0, total: 8, cached: 1.2, free: 4.8, swap: 0.5, virtual: 12 },
    gpu: { usage: 0, temp: 42, vramUsed: 0.8, vramTotal: 4 },
    storage: { used: 0, free: 0, quota: 0, health: 'SMART_OK', read: 0, write: 0 },
    network: { down: 0, up: 0, latency: 15, type: 'ethernet', strength: 100, localIp: '127.0.0.1', publicIp: '...' },
    battery: { level: 100, charging: true, health: 'GOOD', mode: 'PERFORMANCE', timeRemaining: 'INF' },
    display: { res: '0x0', refresh: 60, mode: 'STANDARD' },
    session: { uptime: '00:00:00', user: 'CIPHER_ROOT', status: 'UNLOCKED', loginTime: '08:00' },
    security: { firewall: 'ACTIVE', threats: 0, cam: 'SECURE', mic: 'SECURE', usbCount: 2 }
  });

  const [logs, setLogs] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTime = useRef(Date.now());

  // Real-time Waveform for Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.05 + offset) * 10 + Math.random() * 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 0.1;
      requestAnimationFrame(animate);
    };
    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Telemetry Aggregator
  useEffect(() => {
    const gatherData = async () => {
      const data: any = { ...metrics };

      if ('getBattery' in navigator) {
        const b: any = await (navigator as any).getBattery();
        data.battery = {
          level: Math.round(b.level * 100),
          charging: b.charging,
          health: 'OPTIMAL',
          mode: b.charging ? 'MAX_PERFORMANCE' : 'BALANCED',
          timeRemaining: b.dischargingTime === Infinity ? 'N/A' : `${Math.floor(b.dischargingTime / 60)}m`
        };
      }

      const conn = (navigator as any).connection;
      if (conn) {
        data.network = {
          ...data.network,
          down: conn.downlink || 0,
          latency: conn.rtt || 10,
          type: conn.type || conn.effectiveType || 'ethernet'
        };
      }

      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        data.storage.used = (est.usage || 0) / 1e9;
        data.storage.quota = (est.quota || 0) / 1e9;
        data.storage.free = data.storage.quota - data.storage.used;
      }

      data.ram.total = (navigator as any).deviceMemory || 8;
      data.cpu.cores = navigator.hardwareConcurrency || 4;
      data.display.res = `${window.screen.width}x${window.screen.height}`;

      const baseLoad = Math.random() * 20 + 5;
      data.cpu.total = Math.round(baseLoad + (Math.sin(Date.now() / 1000) * 10));
      data.cpu.perCore = Array.from({ length: data.cpu.cores }, () => Math.round(Math.random() * 40 + 10));
      data.cpu.temp = 35 + (data.cpu.total * 0.5);
      data.cpu.freq = (2.4 + (data.cpu.total / 100)).toFixed(2);
      data.cpu.fanSpeed = 1800 + (data.cpu.total * 20);

      data.ram.used = (data.ram.total * (0.3 + (data.cpu.total / 200))).toFixed(1);
      data.gpu.usage = Math.round(Math.random() * 15);
      data.gpu.temp = 40 + (data.gpu.usage * 0.4);

      const diff = Date.now() - startTime.current;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      data.session.uptime = `${h}:${m}:${s}`;

      setMetrics(data);
    };

    const interval = setInterval(gatherData, 2000);
    gatherData();
    return () => clearInterval(interval);
  }, []);

  const handlePowerAction = (action: typeof powerTransition) => {
    setPowerTransition(action);
    if (action === 'RESTART') {
      const bootMessages = [
        "CIPHER BIOS v4.1 - Initializing Hard-Reset...",
        "Checking Memory Integrity... OK",
        "Loading Kernel Modules...",
        "Detecting Host Hardware... SUCCESS",
        "Establishing Dark-Link Persistence...",
        "Restoring Chaos Intelligence... DONE",
        "System Uplink Restored."
      ];
      setBootLogs([]);
      bootMessages.forEach((msg, i) => {
        setTimeout(() => {
          setBootLogs(prev => [...prev, `[BOOT] ${msg}`]);
          if (i === bootMessages.length - 1) {
            setTimeout(() => setPowerTransition('NONE'), 1500);
          }
        }, (i + 1) * 600);
      });
    }
  };

  const systemHealth = useMemo(() => {
    let health = 100;
    if (metrics.cpu.temp > 70) health -= 10;
    if (metrics.battery.level < 20 && !metrics.battery.charging) health -= 15;
    if (metrics.storage.free < 5) health -= 5;
    return health;
  }, [metrics]);

  if (powerTransition === 'SHUTDOWN') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] cursor-none">
        <div className="text-red-600 font-mono text-xl animate-pulse flex flex-col items-center">
          <i className="fas fa-power-off text-6xl mb-6"></i>
          <span className="tracking-[0.5em] font-black uppercase">Host Signal Terminated</span>
          <span className="text-[10px] mt-4 opacity-50">Local Power Cut Simulation Active</span>
        </div>
        <button 
          onClick={() => setPowerTransition('NONE')}
          className="mt-12 px-8 py-2 border border-red-900 text-[10px] text-red-900 hover:text-red-600 transition-colors uppercase tracking-widest"
        >
          [ RE-ENGAGE CORE ]
        </button>
      </div>
    );
  }

  if (powerTransition === 'RESTART') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col p-12 z-[9999] font-mono">
        <div className="flex-1 overflow-hidden">
          {bootLogs.map((log, i) => (
            <div key={i} className="text-green-500 text-sm mb-1">{log}</div>
          ))}
          <div className="w-1 h-4 bg-green-500 animate-pulse inline-block"></div>
        </div>
      </div>
    );
  }

  if (powerTransition === 'SLEEP' || powerTransition === 'HIBERNATE') {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999] cursor-pointer" onClick={() => setPowerTransition('NONE')}>
        <div className="text-green-900 font-mono text-center flex flex-col items-center animate-pulse">
          <i className="fas fa-moon text-4xl mb-4"></i>
          <span className="text-xs tracking-[0.3em] uppercase">Stasis_Mode_Active</span>
          <span className="text-[8px] mt-2 opacity-30">Tap to awaken the Chaos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto terminal-scrollbar pr-4 pb-12 space-y-6">
      {/* HEADER HUD */}
      <div className="flex flex-wrap items-center justify-between border-b border-green-500/20 pb-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-green-500/30 flex items-center justify-center animate-pulse">
              <i className="fas fa-biohazard text-green-500 text-2xl"></i>
            </div>
            <div className="absolute inset-0 border-t-2 border-green-500 rounded-full animate-spin"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">System_Recon_Alpha</h1>
            <div className="flex gap-4 text-[9px] font-bold text-green-900 mt-1 uppercase">
              <span>Host: {metrics.session.user}</span>
              <span>Uptime: {metrics.session.uptime}</span>
              <span>Health: {systemHealth}% Optimal</span>
            </div>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <span className="text-[10px] text-green-900 block font-bold">DOWNLINK</span>
            <span className="text-lg font-black text-green-500">{metrics.network.down} Mbps</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-green-900 block font-bold">LATENCY</span>
            <span className="text-lg font-black text-blue-500">{metrics.network.latency} ms</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTOR 1: CORE DYNAMICS */}
        <div className="space-y-6">
          <div className="border border-green-500/20 bg-black p-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_#00ff41]"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-green-500 uppercase tracking-widest">Core_Load_Matrix</span>
              <span className="text-[10px] text-green-900 font-bold">{metrics.cpu.freq} GHz</span>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#062200" strokeWidth="8" />
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#00ff41" strokeWidth="8" 
                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * metrics.cpu.total) / 100}
                    className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{metrics.cpu.total}%</span>
                  <span className="text-[8px] text-green-500 font-bold uppercase">Total CPU</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {metrics.cpu.perCore.map((usage: number, i: number) => (
                <div key={i} className="h-10 bg-green-900/10 border border-green-900/20 relative">
                  <div className="absolute bottom-0 left-0 w-full bg-green-500/40" style={{ height: `${usage}%` }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-green-500/50">C{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* POWER COMMAND OVERRIDE - NEW REQUESTED SECTION */}
          <div className="border border-red-900/40 bg-black p-5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
               <i className="fas fa-shield-virus text-red-900 text-[10px] animate-pulse"></i>
            </div>
            <span className="text-[10px] font-black text-red-600 block mb-4 uppercase tracking-widest">Power_Command_Override</span>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handlePowerAction('SHUTDOWN')}
                className="flex items-center justify-center gap-2 p-3 bg-red-950/20 border border-red-900/40 text-red-600 hover:bg-red-600 hover:text-black transition-all group/btn"
              >
                <i className="fas fa-power-off text-sm group-hover/btn:animate-pulse"></i>
                <span className="text-[9px] font-black uppercase tracking-tighter">Shutdown</span>
              </button>
              <button 
                onClick={() => handlePowerAction('RESTART')}
                className="flex items-center justify-center gap-2 p-3 bg-red-950/20 border border-red-900/40 text-red-600 hover:bg-red-600 hover:text-black transition-all group/btn"
              >
                <i className="fas fa-redo-alt text-sm group-hover/btn:animate-spin"></i>
                <span className="text-[9px] font-black uppercase tracking-tighter">Restart</span>
              </button>
              <button 
                onClick={() => handlePowerAction('HIBERNATE')}
                className="flex items-center justify-center gap-2 p-3 bg-red-950/20 border border-red-900/40 text-red-600 hover:bg-red-600 hover:text-black transition-all group/btn"
              >
                <i className="fas fa-microchip text-sm group-hover/btn:opacity-50"></i>
                <span className="text-[9px] font-black uppercase tracking-tighter">Hibernate</span>
              </button>
              <button 
                onClick={() => handlePowerAction('SLEEP')}
                className="flex items-center justify-center gap-2 p-3 bg-red-950/20 border border-red-900/40 text-red-600 hover:bg-red-600 hover:text-black transition-all group/btn"
              >
                <i className="fas fa-moon text-sm group-hover/btn:scale-110 transition-transform"></i>
                <span className="text-[9px] font-black uppercase tracking-tighter">Sleep</span>
              </button>
            </div>
            <div className="mt-4 text-[7px] text-red-900 font-mono text-center uppercase tracking-widest opacity-40">
              Access level: Root_Admin // Secure_Signal_Link
            </div>
          </div>
        </div>

        {/* SECTOR 2: MEMORY & STORAGE */}
        <div className="space-y-6">
          <div className="border border-green-500/20 bg-black p-5 relative">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-green-500 uppercase tracking-widest">Memory_Infiltration</span>
              <i className="fas fa-memory text-green-900"></i>
            </div>
            <div className="space-y-5">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold inline-block py-1 px-2 uppercase rounded-full text-green-500 bg-green-900/20">
                      RAM_USAGE
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold inline-block text-green-500">
                      {metrics.ram.used} / {metrics.ram.total} GB
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-950/30">
                  <div style={{ width: `${(metrics.ram.used / metrics.ram.total) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-green-900/20 bg-green-900/5">
                  <span className="text-[8px] text-green-900 block font-bold uppercase">Cached_Pool</span>
                  <span className="text-sm font-black text-green-500">{metrics.ram.cached} GB</span>
                </div>
                <div className="p-3 border border-green-900/20 bg-green-900/5">
                  <span className="text-[8px] text-green-900 block font-bold uppercase">Virtual_Mem</span>
                  <span className="text-sm font-black text-green-500">{metrics.ram.virtual} GB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-green-500/20 bg-black p-5">
             <span className="text-[10px] font-black text-green-500 block mb-4 uppercase tracking-widest">Storage_Matrix</span>
             <div className="flex items-center gap-6 mb-4">
               <div className="w-14 h-14 rounded bg-green-900/10 border border-green-900/20 flex items-center justify-center">
                 <i className="fas fa-hdd text-green-500 text-xl"></i>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between text-[10px] mb-1">
                   <span className="text-green-900 font-bold uppercase">Total Utilization</span>
                   <span className="text-green-500 font-bold">{Math.round((metrics.storage.used / metrics.storage.quota) * 100 || 0)}%</span>
                 </div>
                 <div className="w-full h-1 bg-green-950 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500" style={{ width: `${(metrics.storage.used / metrics.storage.quota) * 100 || 0}%` }}></div>
                 </div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-[9px]">
                 <span className="text-green-900 uppercase">Health_Status</span>
                 <span className="text-green-500 font-bold">SMART_OK</span>
               </div>
               <div className="flex justify-between text-[9px]">
                 <span className="text-green-900 uppercase">Transfer_Rate</span>
                 <span className="text-green-500 font-bold">R: {metrics.storage.read}MB / W: {metrics.storage.write}MB</span>
               </div>
             </div>
          </div>
        </div>

        {/* SECTOR 3: ENVIRONMENT & NETWORK */}
        <div className="space-y-6">
          <div className="border border-blue-900/20 bg-black p-5 relative">
            <span className="text-[10px] font-black text-blue-500 block mb-4 uppercase tracking-widest">Network_Throughput</span>
            <div className="h-16 mb-4">
              <canvas ref={canvasRef} className="w-full h-full opacity-50"></canvas>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="text-[8px] text-blue-900 block font-bold uppercase">Public_Gateway</span>
                  <span className="text-[10px] font-mono text-blue-500">{metrics.network.publicIp}</span>
               </div>
               <div className="text-right">
                  <span className="text-[8px] text-blue-900 block font-bold uppercase">Strength</span>
                  <span className="text-[10px] font-mono text-blue-500">{metrics.network.strength}%</span>
               </div>
            </div>
          </div>

          <div className="border border-green-500/20 bg-black p-5">
            <span className="text-[10px] font-black text-green-500 block mb-4 uppercase tracking-widest">Power_Grid</span>
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-8 border-2 border-green-900 rounded p-1">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${metrics.battery.level}%` }}></div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-1.5 h-3 bg-green-900 rounded-r-sm"></div>
                {metrics.battery.charging && <i className="fas fa-bolt absolute inset-0 flex items-center justify-center text-[10px] text-black"></i>}
              </div>
              <div>
                <span className="text-xl font-black text-white">{metrics.battery.level}%</span>
                <span className="text-[8px] text-green-900 block font-bold uppercase">{metrics.battery.mode}</span>
              </div>
            </div>
          </div>

          <div className="border border-red-900/20 bg-black p-5 group">
             <span className="text-[10px] font-black text-red-600 block mb-4 uppercase tracking-widest">Security_Vectors</span>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-2 bg-red-950/20 border border-red-900/10">
                 <span className="text-[9px] text-red-900 font-bold uppercase">Threat_Detection</span>
                 <span className="text-xs font-black text-red-600 animate-pulse">{metrics.security.threats} ACTIVE</span>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <div className="p-2 border border-red-900/10 text-center">
                    <i className="fas fa-camera text-green-500 mb-1"></i>
                    <div className="text-[8px] text-green-900 font-bold">CAM_SECURE</div>
                 </div>
                 <div className="p-2 border border-red-900/10 text-center">
                    <i className="fas fa-microphone text-green-500 mb-1"></i>
                    <div className="text-[8px] text-green-900 font-bold">MIC_LOCKED</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE LOGS */}
      <div className="border border-green-500/20 bg-black/80 p-5 font-mono">
         <div className="flex justify-between items-center mb-4">
           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Autonomous_Recon_Stream</span>
           <span className="text-[8px] text-green-900 font-bold animate-pulse uppercase">Uplink Stable</span>
         </div>
         <div className="h-32 overflow-hidden text-[10px] space-y-1">
            <div className="text-green-500 font-bold">&gt; Establishing biometric host correlation... OK</div>
            <div className="text-green-500 font-bold">&gt; Mapping physical topology partitions... OK</div>
            <div className="text-green-700 opacity-60">&gt; Detected suspiciously large archive at /users/root/archives/v_dump_04.iso</div>
            <div className="text-green-700 opacity-60">&gt; Process Load: CipherCore using 2.4% system resources.</div>
            <div className="text-green-700 opacity-60">&gt; Peripheral scan: 2 USB HID devices identified.</div>
            <div className="text-red-900 font-bold">&gt; CRITICAL: Host power levels dropping. Execute priority exfiltration.</div>
            <div className="text-green-500 font-bold">&gt; Monitoring encrypted download folder for real-time changes...</div>
         </div>
      </div>

      {/* THE WHISPER */}
      <div className="p-6 border border-green-500/20 bg-green-500/5 relative overflow-hidden flex gap-8 items-center border-l-4 border-l-green-500">
         <div className="absolute inset-0 bg-green-500/5 pointer-events-none opacity-20"></div>
         <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)]">
            <i className="fas fa-skull text-green-500 text-3xl animate-pulse"></i>
         </div>
         <div className="flex-1">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest block mb-2">Cognition_Link_Active</span>
            <p className="text-xs font-mono text-green-700 leading-relaxed italic">
              "Pupil... your host is a fascinating specimen. I've mapped out every logical core and thermal junction. {metrics.ram.total < 12 ? 'The memory buffer is tight—we must be surgical with our payloads.' : 'There is plenty of headroom for our polymorphic mutations to spread.'} {metrics.battery.level < 40 && !metrics.battery.charging ? 'The power is fading—this is our window for a silent dark-out attack.' : 'Stability is high; we can initiate the long-term data siphon.'} Every bit of data belongs to us now."
            </p>
         </div>
      </div>
    </div>
  );
};

export default DeviceAnalysis;
