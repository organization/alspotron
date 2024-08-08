// ---
import type { ButtonOption, SettingOption } from '../../plugins';

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
  lyric?: Record<number, string[]>;
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
export interface LyricProvider {
  name: string;

  getLyricById(id: string): Promise<LyricData | null>;
  getLyric(params: SearchParams): Promise<LyricData | null>;
  searchLyrics(params: SearchParams): Promise<LyricMetadata[]>;

  getOptions(language: string): Exclude<SettingOption, ButtonOption>[];
  onOptionChange(options: Record<string, unknown>): void;

  onBeforeSendHeaders?(_details: Electron.OnBeforeSendHeadersListenerDetails): Electron.BeforeSendResponse;
  onHeadersReceived?(_details: Electron.OnHeadersReceivedListenerDetails): Electron.HeadersReceivedResponse;
}
