
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const DefenseConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Welcome to the AegisCore Strategic Defense Hub. I am your specialized AI consultant. How can I assist you in hardening your infrastructure or analyzing potential threat vectors today?',
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    setMessages(prev => [...prev, assistantMsg]);

    let accumulatedResponse = '';
    // Fix: Using streamCipherIntelligence as streamDefensiveAnalysis does not exist on GeminiService
    await geminiService.streamCipherIntelligence(input, (chunk) => {
      accumulatedResponse += chunk;
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: accumulatedResponse };
        return next;
      });
    });

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <h2 className="font-bold text-slate-200">Defensive Intel Stream</h2>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-700"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 terminal-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white ml-4' 
                : 'bg-slate-800 text-slate-200 mr-4 border border-slate-700'
            }`}>
              <div className="text-xs opacity-50 mb-1 font-mono uppercase tracking-widest">
                {msg.role === 'assistant' ? 'AegisCore // Secure Node' : 'Authorized User // Client'}
              </div>
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                {msg.content || (isLoading && i === messages.length - 1 ? 'Decrypting incoming transmission...' : '')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query technical defense specifications..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefenseConsultant;
