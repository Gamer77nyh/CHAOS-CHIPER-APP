
import React from 'react';
import { ModuleType } from '../types';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const items = [
    { type: ModuleType.TERMINAL, label: 'Mainframe', icon: 'fa-terminal' },
    { type: ModuleType.DEVICE_ANALYSIS, label: 'System Recon', icon: 'fa-microchip' },
    { type: ModuleType.BLACK_VAULT, label: 'Black Vault', icon: 'fa-vault' },
    { type: ModuleType.SHADOW_STEP, label: 'Shadow Step', icon: 'fa-shoe-prints' },
    { type: ModuleType.GHOST_FORGE, label: 'Ghost Forge', icon: 'fa-ghost' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-black border-r border-green-900/30 flex flex-col h-screen transition-all duration-300">
      <div className="p-6 flex flex-col items-center md:items-start gap-3">
        <div className="w-12 h-12 bg-green-500/10 border border-green-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.2)]">
          <i className="fas fa-biohazard text-2xl text-green-500"></i>
        </div>
        <div className="hidden md:block">
          <span className="font-black text-xl tracking-tighter text-green-500 glitch">CHAOS CIPHER</span>
          <div className="text-[10px] text-green-700 font-bold uppercase tracking-widest mt-1">Autonomous Malice v3.1</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-4">
        {items.map((item) => (
          <button
            key={item.type}
            onClick={() => setActiveModule(item.type)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 group ${
              activeModule === item.type
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[inset_0_0_10px_rgba(0,255,65,0.1)]'
                : 'text-green-900 hover:bg-green-500/5 hover:text-green-500'
            }`}
          >
            <i className={`fas ${item.icon} text-lg w-6`}></i>
            <span className="hidden md:block font-bold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-green-900/20 mt-auto">
        <div className="hidden md:block bg-black p-3 border border-red-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Infiltration Active</span>
          </div>
          <p className="text-[9px] text-red-900/80 leading-tight">
            Node: 128.0.x.x - Exfiltrating 4GB...
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
