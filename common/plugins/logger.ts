export interface PluginLog {
  type?: string;

  time: number;
  message: string;

  error?: Error;
  metadata?: unknown[];
}

export type PluginLogType = 'log' | 'error' | 'warn' | 'info' | 'debug';
export type PluginLogger = {
  [Key in PluginLogType]: (...args: unknown[]) => void;
}
