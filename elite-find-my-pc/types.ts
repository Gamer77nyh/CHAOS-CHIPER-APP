
export interface SystemStats {
  cpuUsage: number;
  ramUsage: number;
  networkDown: string;
  networkUp: string;
  ipAddress: string;
  location: string;
  uptime: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  type: 'info' | 'warning' | 'alert';
}

export enum AppState {
  LOGIN,
  DASHBOARD,
  BACKEND_GUIDE
}
