export type PluginLogType = 'log' | 'error' | 'warn' | 'info' | 'debug';
export interface PluginLog {
  type?: PluginLogType;

  time: number;
  message: string;

  error?: Error;
  metadata?: unknown[];
}
export type PluginLogger = {
  [Key in PluginLogType]: (...args: unknown[]) => void;
};
