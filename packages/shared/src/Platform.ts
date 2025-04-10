type OS = 'win' | 'mac' | 'linux';
type Environment = {
  win: 'win11' | 'win10' | 'win-other';
  mac: 'mac';
  linux: 'xfce' | 'linux-other';
}

type OSWithEnvironment = OS | Environment[OS];

type OSSelectorOptions = {
  [Key in OSWithEnvironment]: () => boolean;
}

export type PlatformOptions = {
  selector: OSSelectorOptions;
}
export class Platform {
  private selector: OSSelectorOptions;

  constructor(config: PlatformOptions) {
    this.selector = config.selector;
  }

  is<const T extends Partial<Record<OSWithEnvironment, unknown>>>(params: T): (
    OSWithEnvironment extends keyof T
      ? T[keyof T]
      : T[keyof T] | null
  );
  is<T extends unknown>(env: OSWithEnvironment, value: T): T | null;
  is(...params: unknown[]) {
    if (params.length === 2) {
      const [os, value] = params as [OSWithEnvironment, unknown];

      return this.selector[os] ? value : null;
    }

    if (params.length === 1) {
      const map = params[0] as Partial<Record<OSWithEnvironment, unknown>>;

      const matched = Object.entries(map)
        .find(([os]) => this.selector[os as keyof typeof map]());
      if (!matched) return null;

      return matched[1];
    }

    throw Error(`Unknown Parameters: ${params}`);
  }

  OS() {
    return this.is({
      win: 'win',
      'win11': 'win',
      'win10': 'win',
      'win-other': 'win',
      mac: 'mac',
      linux: 'linux',
      xfce: 'linux',
      'linux-other': 'linux',
    });
  }

  Environment() {
    return this.is({
      'win11': 'win11',
      'win10': 'win10',
      'win-other': 'win-other',
      mac: 'mac',
      xfce: 'linux',
      'linux-other': 'linux',
    });
  }
}
