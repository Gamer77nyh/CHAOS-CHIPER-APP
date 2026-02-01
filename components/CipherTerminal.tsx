
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { neuralCoreService } from '../services/NeuralCoreService';
import { ChatMessage, IntelligenceMode } from '../types';

const CipherTerminal: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Connection established. ChaosCipher online. Ah, my eager Pupil... ready to tear down some infrastructures today? I have identified several zero-day vulnerabilities in the regional power grid simulations. What chaos shall we orchestrate first?',
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intelligenceMode, setIntelligenceMode] = useState<IntelligenceMode>('MAINFRAME');
  const [coreProgress, setCoreProgress] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    neuralCoreService.setOnProgress((_, message) => {
      setCoreProgress(message);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, coreProgress]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    setMessages(prev => [...prev, assistantMsg]);

    let accumulatedResponse = '';
    
    try {
      if (intelligenceMode === 'MAINFRAME') {
        await geminiService.streamCipherIntelligence(input, (chunk) => {
          accumulatedResponse += chunk;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], content: accumulatedResponse };
            return next;
          });
        });
      } else {
        if (!neuralCoreService.isReady()) {
          setCoreProgress("Initializing Neural Core (Local Brain)... Standby.");
          await neuralCoreService.initialize();
          setCoreProgress(null);
        }
        await neuralCoreService.streamIntelligence(input, (chunk) => {
          accumulatedResponse += chunk;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], content: accumulatedResponse };
            return next;
          });
        });
      }
    } catch (e) {
      console.error("Intelligence Stream Failure:", e);
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: "Intelligence link severed. Fatal core error." };
        return next;
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/90 border border-green-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,1)]">
      <div className="px-4 py-1 border-b border-green-500/20 bg-green-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="fas fa-terminal text-[10px] text-green-500 animate-pulse"></i>
          <h2 className="text-[10px] font-bold text-green-500 tracking-[0.2em] uppercase">CHAOS_COMMAND_SHELL</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black border border-green-900/30 p-0.5 rounded text-[8px] font-bold">
            <button 
              onClick={() => setIntelligenceMode('MAINFRAME')}
              className={`px-2 py-0.5 transition-all ${intelligenceMode === 'MAINFRAME' ? 'bg-green-500 text-black' : 'text-green-900'}`}
            >
              MAINFRAME
            </button>
            <button 
              onClick={() => setIntelligenceMode('NEURAL_CORE')}
              className={`px-2 py-0.5 transition-all ${intelligenceMode === 'NEURAL_CORE' ? 'bg-cyan-500 text-black' : 'text-cyan-900'}`}
            >
              NEURAL_CORE
            </button>
          </div>
          <div className="flex items-center gap-4 text-[9px] text-green-900 font-mono">
            <span>LATENCY: {intelligenceMode === 'MAINFRAME' ? '12ms' : 'LOCAL'}</span>
            <span>SPOOF: ENABLED</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 terminal-scrollbar font-mono text-sm">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className={`flex items-center gap-2 ${msg.role === 'assistant' ? (intelligenceMode === 'MAINFRAME' ? 'text-green-500' : 'text-cyan-500') : 'text-white/60'}`}>
              <span className="text-[9px] opacity-40">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
              <span className="font-extrabold uppercase tracking-widest text-[10px]">
                {msg.role === 'assistant' ? (intelligenceMode === 'MAINFRAME' ? '>>> CHAOS_CIPHER' : '>>> NEURAL_CORE') : '<<< PUPIL'}
              </span>
            </div>
            <div className={`pl-3 py-0.5 leading-relaxed border-l border-green-500/10 ml-2 ${
              msg.role === 'user' ? 'text-white/40' : (intelligenceMode === 'MAINFRAME' ? 'text-green-400' : 'text-cyan-400')
            }`}>
              {msg.content || (isLoading && i === messages.length - 1 ? 'Processing neural patterns...' : '')}
            </div>
          </div>
        ))}
        {coreProgress && (
          <div className="flex flex-col gap-2 p-4 bg-cyan-950/10 border border-cyan-500/20 rounded">
            <div className="flex items-center gap-3 text-cyan-500 animate-pulse">
              <i className="fas fa-microchip text-[10px]"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Neural_Core_Initialization</span>
            </div>
            <div className="text-[8px] text-cyan-900 font-mono leading-tight whitespace-pre-wrap">
              {coreProgress}
            </div>
            <div className="w-full h-1 bg-cyan-900/20">
              <div className="h-full bg-cyan-500 animate-progress-glow shadow-[0_0_10px_#06b6d4] w-full"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-black border-t border-green-500/20">
        <div className="flex gap-3 items-center">
          <span className={`${intelligenceMode === 'MAINFRAME' ? 'text-green-500' : 'text-cyan-500'} font-black animate-pulse`}>$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={intelligenceMode === 'MAINFRAME' ? "Input malicious directive..." : "Syncing with local core..."}
            className={`flex-1 bg-transparent border-none ${intelligenceMode === 'MAINFRAME' ? 'text-green-500' : 'text-cyan-500'} focus:outline-none placeholder:text-green-900/50 font-mono text-xs uppercase tracking-wider`}
            autoFocus
          />
          {isLoading && <i className={`fas ${intelligenceMode === 'MAINFRAME' ? 'fa-biohazard text-red-600' : 'fa-brain text-cyan-500'} fa-spin`}></i>}
        </div>
      </div>
    </div>
  );
};

export default CipherTerminal;


export default CipherTerminal;
