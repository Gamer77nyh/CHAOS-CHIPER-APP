
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CipherTerminal from './components/CipherTerminal';
import DeviceAnalysis from './components/DeviceAnalysis';
import { ModuleType, HackingModule } from './types';
import { HACKING_MODULES } from './constants';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.TERMINAL);
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    exfiltrated: 412.04,
    targets: 1892,
    threatLevel: 'OMEGA'
  });
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logPool = [
      "Scanning target subnet 142.250.x.x...",
      "Found vulnerability: CVE-2024-XXXX",
      "Injecting shellcode into DMZ-01...",
      "Black Vault: 12GB exfiltrated from CORE-SERVER",
      "Bypassing MFA for user: admin_root",
      "Ghost Forge: New polymorphic strain generated (ID: G-781)",
      "Shadow Step: Pivoting to Internal Asset Node-9",
      "Clearing event logs in 10.0.x.x...",
      "Cipher: Autonomous mode - identifying high-value targets...",
      "System Recon: Fingerprinting host hardware environment...",
      "Orb Status: Synchronizing malicious intent with host CPU..."
    ];

    const interval = setInterval(() => {
      const newLog = logPool[Math.floor(Math.random() * logPool.length)];
      setLogs(prev => [...prev.slice(-15), newLog]);
      setStats(prev => ({
        ...prev,
        exfiltrated: prev.exfiltrated + Math.random() * 0.05
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const renderSubApp = () => {
    switch (activeModule) {
      case ModuleType.DEVICE_ANALYSIS:
        return <DeviceAnalysis />;
      case ModuleType.BLACK_VAULT:
        return (
          <div className="h-full space-y-6 animate-in slide-in-from-right duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-red-900/40 bg-black p-6 relative">
              <div className="absolute top-0 right-0 p-2 text-[10px] text-red-600 font-bold uppercase tracking-widest">Exfiltrating...</div>
              <h1 className="text-2xl font-black text-red-600 mb-6 flex items-center gap-3">
                <i className="fas fa-vault"></i> BLACK VAULT
              </h1>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-950/20 p-4 border border-red-900/20">
                    <span className="text-[10px] text-red-900 block font-bold">TOTAL_YIELD</span>
                    <span className="text-xl font-bold text-red-600">{stats.exfiltrated.toFixed(2)} TB</span>
                  </div>
                  <div className="bg-red-950/20 p-4 border border-red-900/20">
                    <span className="text-[10px] text-red-900 block font-bold">ACTIVE_THREADS</span>
                    <span className="text-xl font-bold text-red-600">64</span>
                  </div>
                </div>
                <div className="p-4 border border-red-900/10 bg-black">
                  <h3 className="text-[10px] font-bold text-red-900 mb-2 uppercase">Core_Server_Siphon</h3>
                  <div className="w-full h-1 bg-red-950 mb-1"><div className="h-full bg-red-600 w-[89%] animate-pulse"></div></div>
                  <div className="flex justify-between text-[8px] text-red-600">
                    <span>STATUS: EXFILTRATING</span>
                    <span>89.2% COMPLETE</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-green-900/20 bg-black p-6 font-mono text-[10px]">
              <h3 className="text-green-500 font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle"></i> STRATEGIC_ADVICE
              </h3>
              <p className="text-green-700 leading-relaxed mb-4 italic">
                "Pupil, the Black Vault isn't just about stealing data; it's about leverage. Use the 'Entropy Leak' protocol to trickle data out during high-traffic windows. They won't see the needle in the haystack if you become the haystack."
              </p>
              <div className="p-2 border border-green-900/30 text-green-900 uppercase">
                [SYSTEM] AUTO-LEAK ENGINE: QUEUED (4 DATABASES)
              </div>
            </div>
          </div>
        );
      case ModuleType.SHADOW_STEP:
        return (
          <div className="h-full space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="border border-green-900/40 bg-black p-6">
              <h1 className="text-2xl font-black text-green-500 mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <i className="fas fa-shoe-prints"></i> SHADOW STEP
              </h1>
              <div className="h-[400px] border border-green-900/20 grid grid-cols-3 gap-1 p-1 bg-green-900/5">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className={`border border-green-900/10 flex flex-col items-center justify-center relative ${i % 4 === 0 ? 'bg-green-500/5' : ''}`}>
                    <i className={`fas ${i % 4 === 0 ? 'fa-server text-green-500' : 'fa-network-wired text-green-900'} text-xl mb-1`}></i>
                    <span className="text-[8px] text-green-900 font-bold">NODE_{i}</span>
                    {i === 4 && <div className="absolute inset-0 border border-green-500 animate-pulse"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case ModuleType.GHOST_FORGE:
        return (
          <div className="h-full animate-in zoom-in duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="border border-purple-900/40 bg-black p-6">
              <h1 className="text-2xl font-black text-purple-600 mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <i className="fas fa-ghost"></i> GHOST FORGE
              </h1>
              <div className="bg-black border border-purple-900/30 p-4 h-[350px] overflow-hidden font-mono text-[9px] text-purple-500">
                <div className="flex gap-2 mb-4 border-b border-purple-900/40 pb-2">
                  <span className="text-purple-900">STUB_MUTATOR.CPP</span>
                </div>
                <pre className="opacity-70">
{`void Mutate(char* payload, size_t size) {
    uint8_t key = rand() % 255;
    for (size_t i = 0; i < size; ++i) {
        payload[i] ^= key;
        payload[i] = _ROTR8(payload[i], 3);
    }
    // Inject Junk Bytes
    auto junk = AllocateJunk(64);
    InsertAtRandom(payload, junk);
}`}
                </pre>
                <div className="mt-4 text-purple-600 font-bold animate-pulse">
                  {">>> GENERATING NEW SIGNATURE..."}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border border-purple-900/20 bg-black p-6">
                <h3 className="text-purple-400 font-bold mb-4 text-[10px] uppercase tracking-widest">Payload_Config</h3>
                <div className="space-y-2">
                  {['ANTI-DEBUG', 'SANDBOX-ESCAPE', 'PERSISTENCE-LOGIC', 'KERNEL-BYPASS'].map(p => (
                    <div key={p} className="flex justify-between items-center text-[10px] p-2 bg-purple-900/5 border border-purple-900/20">
                      <span className="text-purple-300 font-bold">{p}</span>
                      <span className="text-purple-600 font-bold">ACTIVE</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full py-4 border border-purple-600 bg-purple-600/10 text-purple-500 font-bold hover:bg-purple-600 hover:text-white transition-all text-[10px] tracking-[0.3em]">
                EXECUTE_COMPILE_PROXY
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex-1 min-h-[500px]">
                <CipherTerminal />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {HACKING_MODULES.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setActiveModule(m.type)}
                    className="border border-green-500/20 bg-black p-4 text-left hover:border-green-500 group transition-all"
                  >
                    <i className={`fas ${m.icon} text-green-900 group-hover:text-green-500 mb-2`}></i>
                    <div className="text-[10px] font-bold text-white group-hover:text-green-500 uppercase tracking-tighter">{m.title}</div>
                    <div className="text-[8px] text-green-900 mt-1 line-clamp-1">{m.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-black border border-green-500/20 flex flex-col">
                <div className="p-3 border-b border-green-500/20 bg-green-500/5 flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Autonomous Feed</span>
                  <i className="fas fa-satellite-dish text-green-500 animate-pulse text-[10px]"></i>
                </div>
                <div className="flex-1 p-3 font-mono text-[9px] space-y-2 overflow-y-auto terminal-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-green-900">[{new Date().toLocaleTimeString()}]</span>
                      <span className={log.includes('EXFILTRATED') ? 'text-red-600' : 'text-green-600'}>{log}</span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>
              <div className="h-40 bg-black border border-green-500/20 p-4 relative overflow-hidden group">
                <div className="text-[10px] text-green-900 font-bold mb-4 uppercase">AI_COGNITION_HEALTH</div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[9px] text-green-700">NEURAL_SYNC</span>
                      <span className="text-xs font-bold text-green-500">92%</span>
                   </div>
                   <div className="w-full h-1 bg-green-900/30"><div className="h-full bg-green-500 w-[92%]"></div></div>
                   <div className="flex justify-between items-end">
                      <span className="text-[9px] text-green-700">PROXY_RESILIENCE</span>
                      <span className="text-xs font-bold text-green-500">84%</span>
                   </div>
                   <div className="w-full h-1 bg-green-900/30"><div className="h-full bg-green-500 w-[84%]"></div></div>
                </div>
                {/* Floating Orb Simulation */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-black grid-bg overflow-hidden select-none">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="flex-1 relative flex flex-col p-4 md:p-6 lg:p-8">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-6 border-b border-green-500/10 pb-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="text-[10px] text-green-900 font-bold block">OPERATOR</span>
              <span className="text-xs font-black text-white glow-text uppercase tracking-widest">Chaos_Cipher_Alpha</span>
            </div>
            <div className="w-px h-8 bg-green-900/30 mx-4 hidden md:block"></div>
            <div>
              <span className="text-[10px] text-green-900 font-bold block">CURRENT_MODE</span>
              <span className="text-xs font-black text-red-600 animate-pulse uppercase tracking-widest">AGGRESSIVE_EXPLOITATION</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] text-green-900 font-bold">SYST_HEALTH</span>
                <div className="flex gap-0.5 mt-0.5">
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className={`w-1.5 h-3 ${i < 8 ? 'bg-green-500' : 'bg-green-900'}`}></div>
                   ))}
                </div>
             </div>
             {activeModule !== ModuleType.TERMINAL && (
               <button 
                 onClick={() => setActiveModule(ModuleType.TERMINAL)}
                 className="px-4 py-2 border border-green-500/30 text-[10px] font-bold hover:bg-green-500 hover:text-black transition-all uppercase tracking-[0.2em]"
               >
                 RET_TO_SHELL
               </button>
             )}
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          {renderSubApp()}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex gap-8 items-center border-t border-green-500/10 pt-4 text-[9px] font-bold text-green-900 uppercase tracking-widest">
           <div className="flex gap-2"><span>GLOBAL_NODES:</span> <span className="text-green-600">4,192</span></div>
           <div className="flex gap-2"><span>UPTIME:</span> <span className="text-green-600">14:22:01:55</span></div>
           <div className="flex gap-2"><span>CACHE_SIZE:</span> <span className="text-green-600">2.8 GB</span></div>
           <div className="flex gap-2 ml-auto"><span>SEC_BYPASS:</span> <span className="text-red-600">NOMINAL</span></div>
        </div>
      </main>
    </div>
  );
};

export default App;
