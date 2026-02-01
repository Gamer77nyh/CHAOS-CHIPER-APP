
export enum ModuleType {
  BLACK_VAULT = 'BLACK_VAULT',
  SHADOW_STEP = 'SHADOW_STEP',
  GHOST_FORGE = 'GHOST_FORGE',
  DEVICE_ANALYSIS = 'DEVICE_ANALYSIS',
  TERMINAL = 'TERMINAL',
  PARTICLE_COLLIDER = 'PARTICLE_COLLIDER',
  THREAT_MAP = 'THREAT_MAP'
}

export type VisualMode = 'Dust' | 'Energy' | 'Matrix' | 'Stellar';

export interface GestureData {
  gesture: 'OpenPalm' | 'Fist' | 'Pinch' | 'TwoFingers' | 'None' | 'SwipeLeft' | 'SwipeRight';
  pinchDistance: number;
  center: { x: number; y: number };
}

export interface AppSettings {
  sensitivity: number;
  mode: VisualMode;
  isCameraEnabled: boolean;
  showHints: boolean;
  particleCount: number;
  glowIntensity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface HackingModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: ModuleType;
  description: string;
  capabilities: string[];
}
