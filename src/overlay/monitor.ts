import { EventEmitter } from 'events';

export type ProcMonitorEventEmitter = EventEmitter<{
  'creation': [pid: number, name: string, path: string];
  'deletion': [pid: number, name: string];
}>;

export type ProcessInfo = {
  pid: number;
  name: string;
  path: string;
};

export interface ProcMonitor {
  get event(): ProcMonitorEventEmitter;
  getProcessList(): ProcessInfo[];

  close(): Promise<void>;
}

export async function getProcMonitor(): Promise<ProcMonitor> {
  switch (process.platform) {
    case 'win32': {
      const win32Module = await import('./win32');
      return await win32Module.Win32ProcMonitor.initialize();
    }

    default: {
      const event: ProcMonitorEventEmitter = new EventEmitter();
      return {
        event,
        getProcessList() {
          return [];
        },
        async close() {},
      };
    }
  }
}

// wql-process-monitor fix
if (process.platform === 'win32') {
  console.log('applying wql process monitor fix');
  // HACK: import statement is not work because Electron's threading model is different from Windows COM's
  const wql =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@jellybrick/wql-process-monitor') as typeof import('@jellybrick/wql-process-monitor');
  wql.promises.createEventSink();
}
