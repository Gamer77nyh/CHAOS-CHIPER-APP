
import React, { useState, useEffect } from 'react';
import { 
  Activity, Bell, Camera, Lock, Volume2, Shield, 
  MapPin, Globe, Wifi, LogOut, Info
} from 'lucide-react';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer 
} from 'recharts';
import { InspectSystemStats, InspectSecurityLog } from '../types';
import InspectCameraFeed from './InspectCameraFeed';
import { geminiService } from '../services/geminiService';

interface InspectDashboardProps {
  onShowGuide: () => void;
  onLogout: () => void;
}

const InspectDashboard: React.FC<InspectDashboardProps> = ({ onShowGuide, onLogout }) => {
  const [stats, setStats] = useState<InspectSystemStats>({
    cpuUsage: 0,
    ramUsage: 0,
    networkDown: "0 KB/s",
    networkUp: "0 KB/s",
    ipAddress: "192.168.1.105",
    location: "Abuja, NG",
    uptime: "2d 4h 12m"
  });

  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<InspectSecurityLog[]>([]);
  const [isAlarming, setIsAlarming] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("Analyzing target node telemetry...");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const cpu = Math.floor(Math.random() * 40) + 10;
      const ram = Math.floor(Math.random() * 20) + 40;
      setStats(prev => ({
        ...prev,
        cpuUsage: cpu,
        ramUsage: ram,
        networkDown: `${(Math.random() * 5).toFixed(1)} MB/s`,
        networkUp: `${(Math.random() * 1).toFixed(1)} MB/s`,
      }));

      setHistory(prev => {
        const next = [...prev, { time: new Date().toLocaleTimeString(), cpu, ram }];
        if (next.length > 20) return next.slice(1);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const triggerAlarm = () => {
    setIsAlarming(true);
    addLog("REMOTE_ALARM_ENGAGED", "alert");
    setTimeout(() => setIsAlarming(false), 5000);
  };

  const lockPC = () => {
    addLog("NODE_LOCK_INITIATED", "warning");
    alert("PC Locking command sent to server.");
  };

  const addLog = (event: string, type: InspectSecurityLog['type']) => {
    const newLog: InspectSecurityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      event,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  const runAiAnalysis = async () => {
    setIsLoadingAi(true);
    setAiAnalysis("Syncing with AI Oracle...");
    try {
      let response = '';
      await geminiService.streamCipherIntelligence(
        `Analyze these target node stats: CPU ${stats.cpuUsage}%, RAM ${stats.ramUsage}%, Uptime ${stats.uptime}. Provide a very short, sinister security report as ChaosCipher (max 2 sentences).`,
        (chunk) => { response += chunk; }
      );
      setAiAnalysis(response || "Intelligence link failed.");
    } catch (err) {
      setAiAnalysis("Unable to establish neural link. Check system encryption.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    runAiAnalysis();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 terminal-scrollbar bg-black/20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-green-950/20 border border-green-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.05)] sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold text-green-400 tracking-tight">SHADOW_NEXUS</h1>
            <p className="text-[10px] text-green-800 font-bold tracking-widest uppercase">Node: TARGET-ALPHA | Status: <span className="text-green-500 animate-pulse">MONITORED</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onShowGuide}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/10 border border-green-600/20 hover:bg-green-600/20 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all text-green-400"
          >
            <Info className="w-4 h-4" /> SETUP_LOGS
          </button>
          <button 
            onClick={onLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="CPU_LOAD" value={`${stats.cpuUsage}%`} sub="Target_Process" icon={Activity} color="text-green-400" />
            <MetricCard label="MEMORY" value={`${stats.ramUsage}%`} sub="Allocated" icon={Shield} color="text-green-400" />
            <MetricCard label="UPLINK" value={stats.networkUp} sub="Exfiltration" icon={Wifi} color="text-green-400" />
            <MetricCard label="UPTIME" value={stats.uptime} sub="Session_Age" icon={Globe} color="text-green-400" />
          </div>

          <div className="bg-green-950/20 border border-green-500/10 rounded-2xl p-6 h-80 relative backdrop-blur-sm">
            <h3 className="text-[10px] font-orbitron font-bold text-green-900 mb-6 flex items-center gap-2 tracking-widest uppercase">
              <Activity className="w-4 h-4 text-green-400" /> PERFORMANCE_TELEMETRY
            </h3>
            <div className="h-[calc(100%-2rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #166534', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: '#22c55e' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#22c55e" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-green-950/20 border border-green-500/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-[10px] font-orbitron font-bold text-orange-900 mb-4 flex items-center gap-2 tracking-widest uppercase">
              <Bell className="w-4 h-4 text-orange-500" /> SECURITY_EVENT_LOG
            </h3>
            <div className="space-y-3">
              {logs.length === 0 && <p className="text-green-900 text-[10px] font-bold tracking-widest uppercase italic opacity-50">Clean_Buffer: No incidents.</p>}
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-green-900/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'alert' ? 'bg-red-500 animate-ping' : log.type === 'warning' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${log.type === 'alert' ? 'text-red-500' : 'text-green-400'}`}>{log.event}</span>
                  </div>
                  <span className="text-[9px] text-green-900 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-green-900/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-orbitron font-black text-green-400 tracking-[0.2em] uppercase">Shadow_Oracle</h3>
              <button onClick={runAiAnalysis} disabled={isLoadingAi} className="p-1 hover:bg-white/5 rounded transition-all">
                <Activity className={`w-3 h-3 text-green-500 ${isLoadingAi ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="relative p-4 bg-black/60 rounded-xl border border-green-500/10 italic text-[11px] text-green-300/80 leading-relaxed font-mono">
              "{aiAnalysis}"
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-green-600 text-[8px] font-black rounded text-white tracking-widest">ENCRYPTED_FEED</div>
            </div>
          </div>

          <div className="bg-green-950/20 border border-green-500/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-[10px] font-orbitron font-bold text-green-900 tracking-widest uppercase mb-2">Remote_Override</h3>
            <button 
              onClick={triggerAlarm}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${isAlarming ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20'}`}
            >
              <Volume2 className="w-4 h-4" /> {isAlarming ? "ALARM_ACTIVE" : "INIT_ALARM"}
            </button>
            <button 
              onClick={lockPC}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase bg-green-900/10 hover:bg-green-900/20 text-green-400 border border-green-900/30 transition-all"
            >
              <Lock className="w-4 h-4" /> LOCK_NODE
            </button>
          </div>

          <div className="bg-green-950/20 border border-green-500/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-[10px] font-orbitron font-bold text-green-900 tracking-widest uppercase flex items-center justify-between">
              LIVE_SURVEILLANCE
              <span className="flex items-center gap-1 text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded animate-pulse">REC</span>
            </h3>
            <InspectCameraFeed />
          </div>

          <div className="bg-green-950/20 border border-green-500/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-green-400 opacity-50" />
                <div>
                  <p className="text-[8px] text-green-900 font-black tracking-widest uppercase">Target_IP</p>
                  <p className="text-[10px] font-mono text-green-300 tracking-tighter">{stats.ipAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-400 opacity-50" />
                <div>
                  <p className="text-[8px] text-green-900 font-black tracking-widest uppercase">Location</p>
                  <p className="text-[10px] font-black text-green-300 uppercase">{stats.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string, value: string, sub: string, icon: any, color: string }> = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-green-950/20 border border-green-500/10 rounded-2xl p-5 hover:bg-green-500/5 transition-all group backdrop-blur-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[8px] font-orbitron text-green-900 tracking-[0.2em] font-black uppercase">{label}</span>
      <Icon className={`w-3 h-3 ${color} opacity-70`} />
    </div>
    <div className={`text-xl font-bold font-orbitron mb-1 group-hover:scale-105 transition-transform text-green-200 tracking-tight`}>{value}</div>
    <div className="text-[8px] text-green-900 font-black uppercase tracking-widest">{sub}</div>
  </div>
);

export default InspectDashboard;
