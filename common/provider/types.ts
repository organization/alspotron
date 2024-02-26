// ---
export type LyricTimestamp = number;
export type LyricRegister = {
  id?: string;
  name: string;
};

// ---
export type LyricMetadata = {
  id: string;
  title: string;
  album?: string;
  artist?: string;
  playtime?: LyricTimestamp;
  registerDate?: Date;
};

export type LyricData = LyricMetadata & {
  lyric: Record<number, string[]>;
  lyricRaw?: string;
  register?: LyricRegister;
};

// ---
export type SearchParams = {
  title?: string;
  artist?: string;
  album?: string;
  playtime?: LyricTimestamp;
  page?: number;
};
export abstract class BaseLyricProvider {
  static readonly provider: string;

  abstract getLyricById(id: string): Promise<LyricData | null>;
  abstract getLyric(params: SearchParams): Promise<LyricData | null>;

  abstract searchLyrics(params: SearchParams): Promise<LyricMetadata[]>;

  static onBeforeSendHeaders(_details: Electron.OnBeforeSendHeadersListenerDetails): Electron.BeforeSendResponse {
    return {};
  }
  static onHeadersReceived(_details: Electron.OnHeadersReceivedListenerDetails): Electron.HeadersReceivedResponse {
    return {};
  }
}
