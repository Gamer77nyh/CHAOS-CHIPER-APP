
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Bell, Camera, Lock, Volume2, Shield, 
  MapPin, Globe, Wifi, Settings, LogOut, Info, AlertTriangle 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { SystemStats, SecurityLog } from '../types';
import CameraFeed from './CameraFeed';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  onShowGuide: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onShowGuide }) => {
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 0,
    ramUsage: 0,
    networkDown: "0 KB/s",
    networkUp: "0 KB/s",
    ipAddress: "192.168.1.105",
    location: "New York, US",
    uptime: "2d 4h 12m"
  });

  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isAlarming, setIsAlarming] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("Initializing Security Engine...");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Mock interval for stats
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
    addLog("REMOTE ALARM TRIGGERED", "alert");
    setTimeout(() => setIsAlarming(false), 5000);
  };

  const lockPC = () => {
    addLog("LOCK COMMAND SENT", "warning");
    alert("PC Locking command sent to server.");
  };

  const addLog = (event: string, type: SecurityLog['type']) => {
    const newLog: SecurityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      event,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  const runAiAnalysis = async () => {
    setIsLoadingAi(true);
    setAiAnalysis("Consulting Security AI...");
    try {
      // Fix: Follow @google/genai Coding Guidelines for initialization.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these system stats: CPU ${stats.cpuUsage}%, RAM ${stats.ramUsage}%, Uptime ${stats.uptime}. Provide a short "JARVIS-style" security report (max 2 sentences).`,
      });
      // Fix: Access .text property directly.
      setAiAnalysis(response.text || "Report generation failed.");
    } catch (err) {
      setAiAnalysis("Unable to establish neural link with Gemini. Check system encryption keys.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    runAiAnalysis();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-6 glow-blue sticky top-4 z-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold">ELITE COMMAND CENTER</h1>
            <p className="text-sm text-slate-400">Node: DESKTOP-MAIN | Status: <span className="text-green-400 animate-pulse">ENCRYPTED</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onShowGuide}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all"
          >
            <Info className="w-4 h-4" /> Setup Instructions
          </button>
          <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="CPU LOAD" value={`${stats.cpuUsage}%`} sub="System Process" icon={Activity} color="text-blue-400" />
            <MetricCard label="MEMORY" value={`${stats.ramUsage}%`} sub="7.4GB / 16GB" icon={Shield} color="text-cyan-400" />
            <MetricCard label="NETWORK" value={stats.networkDown} sub="Download Rate" icon={Wifi} color="text-green-400" />
            <MetricCard label="UPTIME" value={stats.uptime} sub="Active Session" icon={Globe} color="text-purple-400" />
          </div>

          {/* Activity Chart */}
          <div className="glass rounded-2xl p-6 h-80 relative">
            <h3 className="text-sm font-orbitron mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> PERFORMANCE TELEMETRY
            </h3>
            <div className="h-[calc(100%-2rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#38bdf8" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Security Log */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-orbitron mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-400" /> SECURITY LOG
            </h3>
            <div className="space-y-3">
              {logs.length === 0 && <p className="text-slate-500 text-sm">No recent incidents detected.</p>}
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'alert' ? 'bg-red-500 animate-ping' : log.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    <span className={`text-sm font-medium ${log.type === 'alert' ? 'text-red-400' : 'text-slate-300'}`}>{log.event}</span>
                  </div>
                  <span className="text-xs text-slate-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & AI */}
        <div className="space-y-6">
          {/* AI Analysis Card */}
          <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-orbitron text-blue-300">SECURITY ADVISOR</h3>
              <button onClick={runAiAnalysis} disabled={isLoadingAi} className="p-1 hover:bg-white/10 rounded">
                <Activity className={`w-4 h-4 ${isLoadingAi ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="relative p-4 bg-slate-900/40 rounded-xl border border-blue-500/10 italic text-sm text-slate-300 leading-relaxed">
              "{aiAnalysis}"
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded">AI ENCRYPTED</div>
            </div>
          </div>

          {/* Action Center */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-orbitron mb-2">REMOTE OVERRIDE</h3>
            <button 
              onClick={triggerAlarm}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${isAlarming ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'}`}
            >
              <Volume2 className="w-5 h-5" /> {isAlarming ? "ALARM ACTIVE" : "PLAY LOUD ALARM"}
            </button>
            <button 
              onClick={lockPC}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
            >
              <Lock className="w-5 h-5" /> LOCK SYSTEM
            </button>
          </div>

          {/* Camera Feed */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-orbitron flex items-center justify-between">
              LIVE SURVEILLANCE
              <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-2 rounded">REC</span>
            </h3>
            <CameraFeed />
          </div>

          {/* IP & Location */}
          <div className="glass rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">REMOTE IP ADDRESS</p>
                  <p className="text-sm font-mono text-slate-200">{stats.ipAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-slate-500">TRIANGULATED POSITION</p>
                  <p className="text-sm font-semibold text-slate-200">{stats.location}</p>
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
  <div className="glass rounded-2xl p-5 hover:bg-slate-800/50 transition-all group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-orbitron text-slate-500 tracking-wider">{label}</span>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className={`text-2xl font-bold font-orbitron mb-1 group-hover:scale-105 transition-transform`}>{value}</div>
    <div className="text-[10px] text-slate-500 uppercase">{sub}</div>
  </div>
);

export default Dashboard;
