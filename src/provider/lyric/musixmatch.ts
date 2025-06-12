import { z } from 'zod';
import makeCookieFetch from 'fetch-cookie';
import Spotify from 'searchtify';

import {
  LyricProvider,
  LyricData,
  LyricMetadata,
  SearchParams,
} from '../../../common/provider';

import type { ButtonOption, SettingOption } from '../../../common/plugins';

const cookieFetch = makeCookieFetch(fetch);
const spotify = new Spotify();

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

  async getUserToken() {
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
    return this.usertoken;
  }

  async getLyricById(id: string): Promise<LyricData | null> {
    const query = new URLSearchParams();
    query.set('commontrack_id', this.encode(id));
    query.set('usertoken', this.encode(await this.getUserToken()));
    query.set('app_id', this.encode("mac-ios-v2.0"));
    query.set("selected_language", "ko");
    console.log("[LYRS] [MusixMatch] Fetching lyric by ID", id, query.toString());

    const response = await cookieFetch(
      `https://apic.musixmatch.com/ws/1.1/macro.subtitles.get?${query.toString()}`,
    );
    const json = await response.json() as any;
    const success = json.message?.body?.macro_calls?.['track.lyrics.get']?.message?.header?.status_code === 200
    if(!success) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch lyrics', json);
      return null;
    }
    const parsed = await LyricResponseSchema.spa({
      id: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.commontrack_id,
      name: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.track_name,
      trackName: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.track_name,
      artistName: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.artist_name,
      albumName: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.album_name,
      duration: json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.track_length,
      instrumental: !!json.message?.body?.macro_calls?.['matcher.track.get']?.message?.body?.track?.instrumental,
      plainLyrics: json.message?.body?.macro_calls?.['track.subtitles.get']?.message?.body?.subtitle_list[0]?.subtitle?.subtitle_body || '',
      syncedLyrics: json.message?.body?.macro_calls?.['track.subtitles.get']?.message?.body?.subtitle_list[0]?.subtitle?.subtitle_body || '',
    });
    console.log("[LYRS] [MusixMatch] Parsed lyric response", parsed);

    if (!parsed.success) return null;

    const lyric = parsed.data;
    if (!lyric.syncedLyrics) return null;

    const convertedLyrics = this.syncedLyricsToLyric(lyric.syncedLyrics);
    // https://apic.musixmatch.com/ws/1.1/crowd.track.translations.get?app_id=mac-ios-v2.0&usertoken=250612270d57606098b5b857dc3f0e7cf3911ea4628735df121d6a&track_itunes_id=1648877323&selected_language=ko

    const translationResponse = await cookieFetch(`https://apic.musixmatch.com/ws/1.1/crowd.track.translations.get?app_id=mac-ios-v2.0&usertoken=${this.encode(await this.getUserToken())}&commontrack_id=${this.encode(lyric.id.toString())}&selected_language=ko`);
    const translationJson = await translationResponse.json() as any;
    const translationSuccess = translationJson.message?.header?.status_code === 200;
    if(!translationSuccess) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch translation', translationJson);
    } else {
      const translation = translationJson.message?.body?.translations_list.map((t: any) => ({
        source: t.translation.subtitle_matched_line,
        target: t.translation.description
      }));
      if(translation) {
        for(const tr of translation) {
          const { source, target } = tr;
          for(const [timestamp, lines] of Object.entries(convertedLyrics)) {
            const lineIndex = lines.findIndex(line => line == source);
            if(lineIndex !== -1) convertedLyrics[Number(timestamp)] = [...lines as any, target];
          }
        }
        console.log(convertedLyrics)
      }
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
    // if (params.title) query.set('q_track', this.encode(params.title));
    // if (params.artist) query.set('q_artist', this.encode(params.artist));
    query.set('usertoken', this.encode(await this.getUserToken()));
    query.set('app_id', this.encode("mac-ios-v2.0"));
    const spotifyId = await this.getSpotifyId(params.title || "", params.artist || "");
    if(!spotifyId) {
      console.warn('[Lyrs] [MusixMatch] No Spotify ID found for search', params);
      return null;
    }
    query.set('track_spotify_id', this.encode(spotifyId || ""));
    // const itunesId = await this.getItunesId(params.title || "", params.artist || "");
    // if(!itunesId) {
    //   console.warn('[Lyrs] [MusixMatch] No iTunes ID found for search', params);
    //   return null;
    // }
    // query.set('track_itunes_id', this.encode(itunesId || ""));
    console.log("[Lyrs] [MusixMatch] Fetching lyrics with query", query.toString());

    const response = await cookieFetch(
      `https://apic.musixmatch.com/ws/1.1/macro.subtitles.get?${query.toString()}`,
    );
    const json = await response.json() as any;
    const success = json.message?.body?.macro_calls?.['track.lyrics.get']?.message?.header?.status_code === 200
    if(!success) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch lyrics', json);
      return null;
    }
    const parsed = await LyricResponseSchema.array().spa([{
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
    console.log(convertedLyrics)

    return {
      ...this.responseToMetadata(lyric),

      lyric: convertedLyrics,
      lyricRaw: lyric.syncedLyrics,
    };
  }

  async searchLyrics(params: SearchParams): Promise<LyricMetadata[]> {
    if (params.page && params.page > 1) return [];

    const query = new URLSearchParams();
    // if (params.title) query.set('q_track', this.encode(params.title));
    // if (params.artist) query.set('q_artist', this.encode(params.artist));
    query.set('usertoken', this.encode(await this.getUserToken()));
    query.set('app_id', this.encode("mac-ios-v2.0"));
    const spotifyId = await this.getSpotifyId(params.title || "", params.artist || "");
    if(!spotifyId) {
      console.warn('[Lyrs] [MusixMatch] No Spotify ID found for search', params);
      return [];
    }
    query.set('track_spotify_id', this.encode(spotifyId || ""));
    // const itunesId = await this.getItunesId(params.title || "", params.artist || "");
    // if(!itunesId) {
    //   console.warn('[Lyrs] [MusixMatch] No iTunes ID found for search', params);
    //   return [];
    // }
    // query.set('track_itunes_id', this.encode(itunesId || ""));

    const response = await cookieFetch(
      `https://apic.musixmatch.com/ws/1.1/macro.subtitles.get?${query.toString()}`,
    );
    const json = await response.json() as any;
    const success = json.message?.body?.macro_calls?.['track.lyrics.get']?.message?.header?.status_code === 200
    if(!success) {
      console.warn('[Lyrs] [MusixMatch] Failed to fetch lyrics', json);
      return [];
    }
    const parsed = await LyricResponseSchema.array().spa([{
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

    if (!parsed.success) {
      console.warn(
        '[Lyrs] [MusixMatch] Failed to parse search response',
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

  private async getSpotifyId(title: string, artist: string): Promise<string | null> {
    const search = await spotify.search(decodeURIComponent(title) + ' ' + decodeURIComponent(artist));
    if(!search || !search.tracksV2 || !search.tracksV2.items || search.tracksV2.items.length === 0) {
      console.warn('[Lyrs] [MusixMatch] No Spotify ID found for search', title, artist);
      return null;
    }
    console.log("[Lyrs] [MusixMatch] Fetched Spotify ID", search.tracksV2.items[0].item.data.id);
    return search.tracksV2.items[0].item.data.id;
  }

  private async getItunesId(title: string, artist: string): Promise<string | null> {
    // https://itunes.apple.com/search?term=ヨルシカ だから僕は音楽を辞めた&entity=musicTrack&limit=1
    const query = new URLSearchParams();
    query.set('term', artist + ' ' + title);
    query.set('entity', 'musicTrack');
    query.set('limit', '1');
    console.log("[Lyrs] [MusixMatch] Fetching iTunes ID with query", query.toString());
    const response = await fetch(`https://itunes.apple.com/search?${query.toString()}`);
    const json = await response.json() as any;
    if (!json || json.resultCount === 0) {
      console.warn('[Lyrs] [MusixMatch] No results found for iTunes search', json);
      return null;
    }
    console.log("[Lyrs] [MusixMatch] Fetched iTunes ID", json.results[0].trackId);
    return json.results[0].trackId;
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
