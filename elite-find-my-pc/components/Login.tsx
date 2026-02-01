
import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 glass rounded-2xl glow-blue text-center relative overflow-hidden">
        <div className="scanline"></div>
        
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/40">
          <Shield className="w-10 h-10 text-blue-400 animate-pulse" />
        </div>

        <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
          ELITE ACCESS
        </h1>
        <p className="text-slate-400 text-sm mb-8 tracking-widest uppercase">Central Command Unit</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              placeholder="ENCRYPTION KEY"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-center tracking-[0.5em] focus:outline-none focus:border-blue-500 transition-all text-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-orbitron font-bold rounded-xl transition-all active:scale-95 glow-blue"
          >
            INITIALIZE SESSION
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-slate-500 text-xs font-medium">
          STRICT AUTHORIZATION PROTOCOL ACTIVE
        </div>
      </div>
    </div>
  );
};

export default Login;
