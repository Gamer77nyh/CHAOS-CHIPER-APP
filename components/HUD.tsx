
import React, { useEffect, useState } from 'react';
import { AppSettings, GestureData, VisualMode } from '../types';
import { 
  Maximize2, Settings, Cpu, Activity, Hand, MousePointer2, Zap, 
  Box, Star, Camera, CameraOff, HelpCircle, AlertTriangle, 
  Binary, MousePointerClick, Shield
} from 'lucide-react';

interface HUDProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  gestureData: GestureData;
  textInput: string;
  setTextInput: (val: string) => void;
  onEnter: () => void;
  fps: number;
  permissionError: string | null;
  onRetryCamera: () => void;
  manualMode: boolean;
  onToggleManual: () => void;
  onExit?: () => void;
}

const HUD: React.FC<HUDProps> = ({ 
  settings, setSettings, gestureData, textInput, setTextInput, 
  onEnter, fps, permissionError, onRetryCamera, manualMode, onToggleManual,
  onExit
}) => {
  const modes: VisualMode[] = ['Dust', 'Energy', 'Matrix', 'Stellar'];
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleCamera = () => {
    if (manualMode) onToggleManual();
    setSettings(s => ({ ...s, isCameraEnabled: !s.isCameraEnabled }));
  };

  return (
    <div className="fixed inset-0 z-10 pointer-events-none font-orbitron text-cyan-400 p-6 flex flex-col justify-between">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg pointer-events-auto shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold">SYSTEM_CORE: STABLE</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 text-[9px]">
              <div className="flex justify-between">
                <span className="opacity-60 uppercase">FPS</span>
                <span className="font-bold ml-2 text-cyan-300">{fps}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60 uppercase">STATE</span>
                <span className="text-green-500">SYNCED</span>
              </div>
            </div>
          </div>

          {onExit && (
            <button 
              onClick={onExit}
              className="bg-black/80 backdrop-blur-md border border-red-500/50 p-4 rounded-lg pointer-events-auto hover:bg-red-500/20 transition-all flex flex-col items-center justify-center min-w-[80px]"
            >
              <Zap size={16} className="text-red-500 mb-1" />
              <span className="text-[10px] uppercase font-bold text-red-500">EXIT_HUD</span>
            </button>
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl pointer-events-auto">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
            placeholder="SEQUENCE_INPUT..."
            className="w-full bg-black/60 border-b-2 border-cyan-500/50 outline-none px-6 py-4 text-2xl tracking-[0.3em] text-center uppercase transition-all text-cyan-400 focus:border-cyan-400 placeholder:text-cyan-900"
          />
        </div>

        <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg pointer-events-auto min-w-[150px]">
          <div className="flex items-center justify-end gap-3 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest">SIGNAL_LINK</span>
            <Binary size={14} className={gestureData.gesture !== 'None' ? 'text-white animate-pulse' : ''} />
          </div>
          <div className="text-[10px] text-right font-bold uppercase text-yellow-400">
            {permissionError ? 'HALTED' : gestureData.gesture}
          </div>
        </div>
      </div>

      {/* Side Controls */}
      <div className="flex justify-between items-center h-full pointer-events-none">
        <div className="space-y-4 pointer-events-auto">
          {modes.map((m) => (
            <button 
              key={m} 
              onClick={() => setSettings(s => ({ ...s, mode: m }))} 
              className={`w-14 h-14 flex flex-col items-center justify-center border transition-all relative ${
                settings.mode === m 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  : 'bg-black/80 border-cyan-900 text-cyan-900 hover:text-cyan-400 hover:border-cyan-400'
              }`}
            >
              {m === 'Dust' && <MousePointer2 size={24} />}
              {m === 'Energy' && <Zap size={24} />}
              {m === 'Matrix' && <Box size={24} />}
              {m === 'Stellar' && <Star size={24} />}
              <span className="text-[7px] font-bold mt-1">{m.toUpperCase()}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col items-end gap-6 pointer-events-auto">
          <button 
            onClick={() => setSettings(s => ({ ...s, showHints: !s.showHints }))} 
            className={`w-14 h-14 flex items-center justify-center border transition-all ${
              settings.showHints 
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'bg-black/80 border-cyan-900 text-cyan-900'
            }`}
          >
            <HelpCircle size={28} />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={toggleCamera} 
            className={`h-16 w-16 border rounded-lg flex flex-col items-center justify-center transition-all ${
              settings.isCameraEnabled ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'
            }`}
          >
            {settings.isCameraEnabled ? <Camera size={24} /> : <CameraOff size={24} />}
            <span className="text-[8px] font-bold mt-1 uppercase">{settings.isCameraEnabled ? 'Sensor_On' : 'Sensor_Off'}</span>
          </button>
          <button 
            onClick={onToggleManual} 
            className={`h-16 w-16 border rounded-lg flex flex-col items-center justify-center transition-all ${
              manualMode ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-cyan-500/30 text-cyan-500/40 hover:text-cyan-400'
            }`}
          >
            <MousePointerClick size={24} />
            <span className="text-[8px] font-bold mt-1 uppercase">M_OVR</span>
          </button>
        </div>
        <div className="text-right text-[8px] uppercase tracking-widest leading-relaxed opacity-60">
          <p>OS_REL: QUANTUM_HUD_v3.2.0</p>
          <p>RENDER_ENGINE: WEBGL_THREE_JS</p>
          <p>BIOMETRIC: MEDIAPIPE_VISION</p>
        </div>
      </div>

      {/* Camera Window */}
      <div className="fixed bottom-6 right-6 w-48 aspect-video bg-black border border-cyan-500/20 overflow-hidden rounded-lg pointer-events-auto">
        {(!settings.isCameraEnabled || permissionError) ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950">
            <span className="text-[10px] font-bold tracking-[0.3em] mb-1 animate-pulse text-cyan-400">OFFLINE</span>
            <div className="w-12 h-0.5 bg-red-500/50" />
          </div>
        ) : (
          <video id="gesture-video" autoPlay playsInline muted className="w-full h-full object-cover opacity-40 grayscale" />
        )}
      </div>
    </div>
  );
};

export default HUD;
