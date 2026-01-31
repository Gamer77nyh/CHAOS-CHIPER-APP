
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Visualizer from './Visualizer';
import HUD from './HUD';
import { GestureService } from '../services/gestureService';
import { AppSettings, GestureData, VisualMode } from '../types';
import { Fingerprint, Zap } from 'lucide-react';

const ParticleColliderModule: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [activeText, setActiveText] = useState('');
  const [isCinematic, setIsCinematic] = useState(false);
  const [fps, setFps] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  
  const [gestureData, setGestureData] = useState<GestureData>({
    gesture: 'None',
    pinchDistance: 0,
    center: { x: 0.5, y: 0.5 }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('particle_hud_settings_v3');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return parsed as AppSettings;
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
    return {
      sensitivity: 1.0,
      mode: 'Dust',
      isCameraEnabled: true,
      showHints: true,
      particleCount: 8000,
      glowIntensity: 1.5,
    };
  });

  useEffect(() => {
    localStorage.setItem('particle_hud_settings_v3', JSON.stringify(settings));
  }, [settings]);

  const gestureServiceRef = useRef<GestureService | null>(null);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  const startCamera = useCallback(async () => {
    const videoElement = document.getElementById('gesture-video') as HTMLVideoElement;
    if (!videoElement) return;

    setPermissionError(null);
    if (!gestureServiceRef.current) {
      const onResults = (res: any) => {
        if (gestureServiceRef.current) setGestureData(gestureServiceRef.current.analyzeGesture(res));
      };
      gestureServiceRef.current = new GestureService(videoElement, onResults);
    }

    try {
      await gestureServiceRef.current.start();
      setManualMode(false);
    } catch (err: any) {
      const msg = (err?.message || err?.toString() || "").toLowerCase();
      if (msg.includes('denied') || msg.includes('notallowed')) {
        setPermissionError('CAMERA_PERMISSION_DENIED');
      } else if (msg.includes('abort')) {
        setPermissionError('GESTURE_ENGINE_ABORTED');
        gestureServiceRef.current = null;
      } else {
        setPermissionError('CAMERA_INIT_FAILURE');
      }
      setSettings(s => ({ ...s, isCameraEnabled: false }));
    }
  }, []);

  const initializeSystem = async () => {
    setIsInitialized(true);
    if (settings.isCameraEnabled) await startCamera();
  };

  useEffect(() => {
    if (isInitialized && settings.isCameraEnabled) startCamera();
    else if (isInitialized && !settings.isCameraEnabled) {
      gestureServiceRef.current?.stop();
      if (!manualMode) setGestureData({ gesture: 'None', pinchDistance: 0, center: { x: 0.5, y: 0.5 } });
    }
    return () => {
      gestureServiceRef.current?.stop();
    };
  }, [isInitialized, settings.isCameraEnabled, startCamera, manualMode]);

  // Handle Manual Input (Mouse + Keyboard)
  useEffect(() => {
    if (!manualMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      setGestureData(prev => ({
        ...prev,
        center: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        pinchDistance: e.shiftKey ? (e.clientY / window.innerHeight) : prev.pinchDistance
      }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setGestureData(prev => ({ ...prev, gesture: 'Fist' }));
    };

    const handleMouseUp = () => {
      setGestureData(prev => ({ ...prev, gesture: 'None' }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') setGestureData(prev => ({ ...prev, gesture: 'Fist' }));
      if (e.key === 'Shift') setGestureData(prev => ({ ...prev, gesture: 'Pinch' }));
      if (e.key === 'Tab') {
        e.preventDefault();
        setGestureData(prev => ({ ...prev, gesture: 'TwoFingers' }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Shift' || e.key === 'Tab') {
        setGestureData(prev => ({ ...prev, gesture: 'None' }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [manualMode]);

  useEffect(() => {
    if (gestureData.gesture === 'SwipeLeft' || gestureData.gesture === 'SwipeRight') {
      const modes: VisualMode[] = ['Dust', 'Energy', 'Matrix', 'Stellar'];
      const cur = modes.indexOf(settings.mode);
      const next = gestureData.gesture === 'SwipeRight' ? (cur + 1) % modes.length : (cur - 1 + modes.length) % modes.length;
      setSettings(s => ({ ...s, mode: modes[next] }));
    }
  }, [gestureData.gesture, settings.mode]);

  useEffect(() => {
    setGlitchActive(true);
    const t = setTimeout(() => setGlitchActive(false), 300);
    return () => clearTimeout(t);
  }, [settings.mode]);

  useEffect(() => {
    let frame: number;
    const update = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleEnter = useCallback(() => {
    if (textInput.trim()) { setIsCinematic(true); setActiveText(textInput); }
  }, [textInput]);

  useEffect(() => {
    if (!textInput) setActiveText('');
    else if (!isCinematic) setActiveText(textInput);
  }, [textInput, isCinematic]);

  if (!isInitialized) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center font-orbitron text-cyan-400">
        <div className="relative p-12 border border-cyan-500/20 bg-black/40 backdrop-blur-xl rounded-2xl flex flex-col items-center max-w-lg text-center shadow-[0_0_50px_rgba(0,255,255,0.1)]">
          <div className="w-24 h-24 mb-8 border-2 border-cyan-400 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(0,255,255,0.4)]">
            <Zap size={48} />
          </div>
          <h1 className="text-3xl font-bold tracking-[0.3em] mb-4 uppercase">Quantum Particle HUD</h1>
          <p className="text-[10px] opacity-60 tracking-widest mb-12">INITIALIZING NEURAL LINK... STANDBY</p>
          <button onClick={initializeSystem} className="group relative px-12 py-5 bg-cyan-500/10 border border-cyan-400 text-cyan-400 font-bold tracking-[0.2em] overflow-hidden transition-all hover:bg-cyan-400 hover:text-black">
            <div className="flex items-center gap-3"><Fingerprint size={20} /><span>SYNC BIOMETRICS</span></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden select-none transition-all duration-300 ${glitchActive ? 'invert brightness-125' : ''}`}>
      <Visualizer text={activeText} settings={settings} gestureData={gestureData} isCinematic={isCinematic} onCinematicComplete={() => setIsCinematic(false)} />
      <HUD 
        settings={settings} setSettings={setSettings} gestureData={gestureData} textInput={textInput} 
        setTextInput={setTextInput} onEnter={handleEnter} fps={fps} permissionError={permissionError} 
        onRetryCamera={startCamera} manualMode={manualMode} onToggleManual={() => { setManualMode(!manualMode); setPermissionError(null); }}
      />
    </div>
  );
};

export default ParticleColliderModule;
