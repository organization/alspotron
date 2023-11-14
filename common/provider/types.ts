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
};
export abstract class BaseLyricProvider {
  static readonly provider: string;

  abstract getLyricById(id: string): Promise<LyricData | null>;
  abstract getLyric(params: SearchParams): Promise<LyricData | null>;

  abstract searchLyrics(params: SearchParams): Promise<LyricMetadata[]>;
}
