import { z } from 'zod';

import {
  LyricProvider,
  LyricData,
  LyricMetadata,
  SearchParams,
} from '../../../common/provider';

import type { ButtonOption, SettingOption } from '../../../common/plugins';

const LyricResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  trackName: z.string(),
  artistName: z.string(),
  albumName: z.string(),
  duration: z.number(), // in seconds not ms
  instrumental: z.boolean().optional(),
  plainLyrics: z.string(),
  syncedLyrics: z.string().nullable(), // [mm:ss.xx] lyrics\n ...
});

export class LrclibLyricProvider implements LyricProvider {
  public name = 'lrclib';

  async getLyricById(id: string): Promise<LyricData | null> {
    const response = await fetch(`https://lrclib.net/api/get/${id}`);
    const json = await response.json();
    const parsed = await LyricResponseSchema.spa(json);
    if (!parsed.success) return null;

    const lyric = parsed.data;
    if (!lyric.syncedLyrics) return null;

    const convertedLyrics = this.syncedLyricsToLyric(lyric.syncedLyrics);

    return {
      ...this.responseToMetadata(lyric),

      lyric: convertedLyrics,
      lyricRaw: lyric.syncedLyrics,
    };
  }

  async getLyric(params: SearchParams): Promise<LyricData | null> {
    if (params.page && params.page > 1) return null;

    const query = new URLSearchParams();
    if (params.title) query.set('track_name', this.encode(params.title));
    if (params.artist) query.set('artist_name', this.encode(params.artist));
    if (params.album) query.set('album_name', this.encode(params.album));

    const response = await fetch(
      `https://lrclib.net/api/search?${query.toString()}`,
    );
    const json = await response.json();
    const parsed = await LyricResponseSchema.array().spa(json);

    if (!parsed.success) {
      console.warn(
        '[Alspotron] [Lrclib] Failed to parse search response',
        parsed.error,
      );
      return null;
    }

    const lyric = parsed.data[0];
    if (!lyric.syncedLyrics) return null;

    const convertedLyrics = this.syncedLyricsToLyric(lyric.syncedLyrics);

    return {
      ...this.responseToMetadata(lyric),

      lyric: convertedLyrics,
      lyricRaw: lyric.syncedLyrics,
    };
  }

  async searchLyrics(params: SearchParams): Promise<LyricMetadata[]> {
    if (params.page && params.page > 1) return [];

    const query = new URLSearchParams();
    if (params.title) query.set('track_name', this.encode(params.title));
    if (params.artist) query.set('artist_name', this.encode(params.artist));
    if (params.album) query.set('album_name', this.encode(params.album));

    const response = await fetch(
      `https://lrclib.net/api/search?${query.toString()}`,
    );
    const json = await response.json();
    const parsed = await LyricResponseSchema.array().spa(json);

    if (!parsed.success) {
      console.warn(
        '[Alspotron] [Lrclib] Failed to parse search response',
        parsed.error,
      );
      return [];
    }

    return parsed.data.map(this.responseToMetadata.bind(this));
  }

  public getOptions(language: string): Exclude<SettingOption, ButtonOption>[] {
    return [];
  }

  public onOptionChange(options: Record<string, unknown>) {}

  private encode(str: string): string {
    return encodeURIComponent(str).replace(/%20/g, '+');
  }

  private responseToMetadata(
    lyric: z.infer<typeof LyricResponseSchema>,
  ): LyricMetadata {
    return {
      id: lyric.id.toString(),
      title: lyric.trackName,
      album: lyric.albumName,
      artist: lyric.artistName,
      playtime: lyric.duration * 1000,
    };
  }

  private syncedLyricsToLyric(lyrics: string): Record<number, string[]> {
    return lyrics.split('\n').reduce(
      (prev, line) => {
        const [time, ...text] = line.split(']');
        const [minute, second] = time.slice(1).split(':').map(Number);
        const timestamp = minute * 60 * 1000 + second * 1000;

        return {
          ...prev,
          [timestamp]: [text.join(']')],
        };
      },
      {} as Record<number, string[]>,
    );
  }
}
