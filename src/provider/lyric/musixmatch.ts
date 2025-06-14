import { z } from 'zod';
import makeCookieFetch from 'fetch-cookie';
import { hangulize } from './hangulize';
import { config } from '../../config';

import {
  LyricProvider,
  LyricData,
  LyricMetadata,
  SearchParams,
} from '../../../common/provider';

import type { ButtonOption, SettingOption } from '../../../common/plugins';

const cookieFetch = makeCookieFetch(fetch);

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

export class MusixMatchLyricProvider implements LyricProvider {
  public name = 'musixmatch';
  private usertoken = ""
  private _updatingUserTokenPromise: Promise<string> | null = null;
  private targetLanguage = "ko";

  async getUserToken() {
    this.targetLanguage = config.get().language
    this.usertoken = config.get().musixMatchToken
    if(this.usertoken) return this.usertoken;
    if(!this._updatingUserTokenPromise) {
      console.log('[Lyrs] [MusixMatch] Fetching user token...');
      this._updatingUserTokenPromise = this._updateUserToken();
    }
    return await this._updatingUserTokenPromise;
  }

  async _updateUserToken() {
    const res = await cookieFetch("https://apic.musixmatch.com/ws/1.1/token.get?app_id=mac-ios-v2.0")
    const json = await res.json() as any
    if (!json || !json.message || json.message.header.status_code !== 200) {
      throw new Error('Failed to fetch user token from MusixMatch');
    }
    this.usertoken = json.message.body.user_token;
    config.set({ musixMatchToken: this.usertoken });
    return this.usertoken;
  }

  async getLyricById(id: string): Promise<LyricData | null> {
    const query = new URLSearchParams();
    query.set('commontrack_id', this.encode(id));
    query.set('usertoken', this.encode(await this.getUserToken()));
    query.set('app_id', this.encode("mac-ios-v2.0"));
    console.log("[LYRS] [MusixMatch] Fetching lyric by ID", id, query.toString());

    const response = await cookieFetch(`https://apic.musixmatch.com/ws/1.1/macro.subtitles.get?${query.toString()}`);
    const json = await response.json() as any;
    const success = json.message?.body?.macro_calls?.['track.lyrics.get']?.message?.header?.status_code === 200
    if(!success) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch lyrics', json);
      return null;
    }
    const parsed = await this.musixmatchMacroToLyricScheme(json);
    if (!parsed.success) return null;

    const lyric = parsed.data[0];
    if (!lyric.syncedLyrics) return null;

    const convertedLyrics = this.syncedLyricsToLyric(lyric.syncedLyrics);

    if(
      this.targetLanguage == "ko" &&
      json.message?.body?.macro_calls?.['track.subtitles.get']?.message?.body?.subtitle_list[0]?.subtitle?.subtitle_language == "ja"
    ) {
      console.log("[Lyrs] [MusixMatch] Found Japanese lyrics, converting to Korean...", await hangulize("日本語"));
      Object.entries(convertedLyrics).forEach(async ([timestamp, lines]) => convertedLyrics[Number(timestamp)].push(await hangulize(lines[0]) as any));
    }

    const translationResponse = await cookieFetch(`https://apic.musixmatch.com/ws/1.1/crowd.track.translations.get?app_id=mac-ios-v2.0&usertoken=${this.encode(await this.getUserToken())}&commontrack_id=${this.encode(lyric.id.toString())}&selected_language=${this.targetLanguage}`);
    const translationJson = await translationResponse.json() as any;
    const translationSuccess = translationJson.message?.header?.status_code === 200;
    if(!translationSuccess) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch translation', translationJson);
    } else {
      const translations = translationJson.message?.body?.translations_list || [];
      translations.forEach((tr: any) => {
        const { subtitle_matched_line: source, description: target } = tr.translation;
        Object.entries(convertedLyrics).forEach(([timestamp, lines]) => lines.includes(source) && convertedLyrics[Number(timestamp)].push(target));
      });
    }

    return {
      ...this.responseToMetadata(lyric),

      lyric: convertedLyrics,
      lyricRaw: lyric.syncedLyrics,
    };
  }

  async getLyric(params: SearchParams): Promise<LyricData | null> {
    if (params.page && params.page > 1) return null;

    const query = new URLSearchParams();
    // If you want to search by title and artist, you can uncomment these lines
    // but, query is must be exactly same with MusixMatch
    // if (params.title) query.set('q_track', this.encode(params.title));
    // if (params.artist) query.set('q_artist', this.encode(params.artist));
    query.set('usertoken', this.encode(await this.getUserToken()));
    query.set('app_id', this.encode("mac-ios-v2.0"));
    const isrc = await this.getIsrc(params.title || "", params.artist || "");
    if(!isrc) {
      console.warn('[Lyrs] [MusixMatch] No isrc ID found for search', params);
      return null;
    }
    query.set('track_isrc', this.encode(isrc || ""));
    console.log("[Lyrs] [MusixMatch] Fetching lyrics with query", query.toString());

    const response = await cookieFetch(`https://apic.musixmatch.com/ws/1.1/macro.subtitles.get?${query.toString()}`);
    const json = await response.json() as any;
    const success = json.message?.body?.macro_calls?.['track.lyrics.get']?.message?.header?.status_code === 200
    if(!success) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch lyrics', json);
      return null;
    }
    const parsed = await this.musixmatchMacroToLyricScheme(json);
    if (!parsed.success) {
      console.warn(
        '[Lyrs] [MusixMatch] Failed to parse search response',
        parsed.error,
      );
      return null;
    }

    const lyric = parsed.data[0];
    console.log("[LYRS] [MusixMatch] Fetched lyric", lyric);
    if (!lyric.syncedLyrics) return null;
    console.log("[LYRS] [MusixMatch] Synced lyrics found", lyric.syncedLyrics)

    const convertedLyrics = this.syncedLyricsToLyric(lyric.syncedLyrics);

    return {
      ...this.responseToMetadata(lyric),

      lyric: convertedLyrics,
      lyricRaw: lyric.syncedLyrics,
    };
  }

  async searchLyrics(params: SearchParams): Promise<LyricMetadata[]> {
    const lyric = await this.getLyric(params);
    if (!lyric) {
      console.warn('[Lyrs] [MusixMatch] No lyrics found for search', params);
      return [];
    }
    return [lyric]
  }

  public getOptions(language: string): Exclude<SettingOption, ButtonOption>[] {
    return [];
  }

  public onOptionChange(options: Record<string, unknown>) {}

  private encode(str: string): string {
    return encodeURIComponent(str).replace(/%20/g, '+');
  }

  private async musixmatchMacroToLyricScheme(json: any) {
    console.log(json.message?.body?.macro_calls?.['track.subtitles.get']?.message?.body?.subtitle_list)
    return await LyricResponseSchema.array().spa([{
      id: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.commontrack_id,
      name: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.track_name,
      trackName: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.track_name,
      artistName: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.artist_name,
      albumName: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.album_name,
      duration: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.track_length,
      instrumental: !!json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.instrumental,
      plainLyrics: json.message?.body?.macro_calls?.['track.subtitles.get']?.message?.body?.subtitle_list[0]?.subtitle?.subtitle_body || '',
      syncedLyrics: json.message?.body?.macro_calls?.['track.subtitles.get']?.message?.body?.subtitle_list[0]?.subtitle?.subtitle_body || '',
    }]);
  }

  private async getIsrc(title: string, artist: string): Promise<string | null> {
    // https://www.shazam.com/services/amapi/v1/catalog/KR/search?types=songs&term=yorushika&limit=3
    const query = new URLSearchParams();
    query.set('term', artist + ' ' + title);
    query.set('types', 'songs');
    query.set('limit', '1');
    const response = await fetch(`https://www.shazam.com/services/amapi/v1/catalog/KR/search?${query.toString()}`);
    const json = await response.json() as any;
    if (!json || json.results?.songs?.data?.length === 0) {
      console.warn('[Lyrs] [MusixMatch] No results found for Isrc search', json);
      return null;
    }
    console.log("[Lyrs] [MusixMatch] Found Isrc ID", json.results.songs.data[0].attributes.isrc);
    return json.results.songs.data[0].attributes.isrc;
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
        const [time, ...text] = line.split('] ');
        const [minute, second] = time.slice(1).split(':').map(Number);
        const timestamp = minute * 60 * 1000 + second * 1000;

        return {
          ...prev,
          [timestamp]: [text.join('] ')],
        };
      },
      {} as Record<number, string[]>,
    );
  }
}
