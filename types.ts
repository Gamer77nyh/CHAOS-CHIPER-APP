
export enum ModuleType {
  BLACK_VAULT = 'BLACK_VAULT',
  SHADOW_STEP = 'SHADOW_STEP',
  GHOST_FORGE = 'GHOST_FORGE',
  DEVICE_ANALYSIS = 'DEVICE_ANALYSIS',
  TERMINAL = 'TERMINAL'
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
