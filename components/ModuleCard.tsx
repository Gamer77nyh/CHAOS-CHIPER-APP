
import React from 'react';
// Fix: Changed DefenseModule to HackingModule to match types.ts
import { HackingModule } from '../types';

interface ModuleCardProps {
  // Fix: Changed DefenseModule to HackingModule
  module: HackingModule;
  onClick: (module: HackingModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  return (
    <div 
      onClick={() => onClick(module)}
      className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer group"
    >
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
        <i className={`fas ${module.icon} text-2xl`}></i>
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{module.title}</h3>
      <p className="text-blue-400 text-sm font-medium mb-4">{module.subtitle}</p>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {module.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {/* Fix: Changed module.concepts to module.capabilities to match HackingModule interface */}
        {module.capabilities.slice(0, 3).map(capability => (
          <span key={capability} className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded">
            {capability}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ModuleCard;
