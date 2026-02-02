
import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';

interface InspectLoginProps {
  onLogin: (pass: string) => void;
}

const InspectLogin: React.FC<InspectLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="w-full max-w-md p-8 bg-green-950/20 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.1)] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
        
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40">
          <Shield className="w-10 h-10 text-green-400 animate-pulse" />
        </div>

        <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
          SHADOW ACCESS
        </h1>
        <p className="text-green-800 text-[10px] mb-8 tracking-[0.3em] uppercase font-bold">Infiltration Node Alpha</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-900" />
            <input
              type="password"
              placeholder="INFILTRATION KEY"
              className="w-full bg-black/60 border border-green-500/20 rounded-xl py-4 pl-12 pr-4 text-center tracking-[0.5em] focus:outline-none focus:border-green-500 transition-all text-green-400 font-mono text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-green-600/20 border border-green-600 hover:bg-green-600/40 text-green-400 font-orbitron font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            ENGAGE LINK
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-green-900/30 text-green-900 text-[9px] font-black tracking-widest uppercase">
          STEALTH PROTOCOL: ACTIVE
        </div>
      </div>
    </div>
  );
};

export default InspectLogin;
