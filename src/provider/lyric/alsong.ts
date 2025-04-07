import type { LyricData, LyricMetadata, LyricProvider, SearchParams } from '../../../common/provider';

import type { Alsong, Lyric as AlsongLyric, LyricMetadata as AlsongLyricMetadata } from 'alsong';
import type { ButtonOption, SettingOption } from '../../../common/plugins';

const convertLyricMetadata = (metadata: AlsongLyricMetadata): LyricMetadata => {
  return {
    id: metadata.lyricId.toString(),
    title: metadata.title,
    album: metadata.album,
    artist: metadata.artist,
    playtime: metadata.playtime,
    registerDate: metadata.registerDate,
  };
};
const convertLyric = (lyric: AlsongLyric): LyricData => {
  return {
    id: lyric.lyricId.toString(),
    title: lyric.title,
    album: lyric.album,
    artist: lyric.artist,
    lyric: lyric.lyric,
    lyricRaw: lyric.lyricRaw,
    register: lyric.register,
  };
};

export class AlsongLyricProvider implements LyricProvider {
  public name = 'alsong';

  private alsong: Alsong;

  constructor(alsong: Alsong) {
    this.alsong = alsong;
  }

  onBeforeSendHeaders(details: Electron.OnBeforeSendHeadersListenerDetails) {
    const isEgg = details.url.startsWith('https://lyric.altools.com');
    if (isEgg) {
      delete details.requestHeaders['Referer'];
      delete details.requestHeaders['sec-ch-ua'];
      delete details.requestHeaders['sec-ch-ua-mobile'];
      delete details.requestHeaders['sec-ch-ua-platform'];
      delete details.requestHeaders['Sec-Fetch-Dest'];
      delete details.requestHeaders['Sec-Fetch-Mode'];
      delete details.requestHeaders['Sec-Fetch-Site'];
      return {
        requestHeaders: {
          ...details.requestHeaders,
          Origin: '*',
          'User-Agent': 'Dalvik/2.2.0 (Linux; U; Android 11; Pixel 4a Build/RQ3A.210805.001.A1)',
        },
      };
    }

    return {};
  }

  onHeadersReceived(details: Electron.OnHeadersReceivedListenerDetails) {
    const isEgg = details.url.startsWith('https://lyric.altools.com');
    if (isEgg) {
      return {
        responseHeaders: {
          'Access-Control-Allow-Origin': ['*'],
          ...details.responseHeaders,
        },
      };
    }

    return {};
  }

  async getLyric(params: SearchParams) {
    const list = await this.searchLyrics(params);
    if (typeof list[0]?.id !== 'string') return null;

    return this.getLyricById(list[0].id);
  }

  async getLyricById(id: string) {
    const result = await this.alsong.getLyricById(id);
    if (!result) return null;

    return convertLyric(result);
  }

  async searchLyrics(params: SearchParams) {
    const artist = params.artist ?? '';
    const title = params.title ?? '';
    const page = params.page ?? 0;

    const result = await this.alsong(artist, title, {
      playtime: params.playtime,
      page,
    }).catch(() => []);
    return result.map(convertLyricMetadata);
  }

  public getOptions(language: string): Exclude<SettingOption, ButtonOption>[] {
    return [];
  }

  public onOptionChange(options: Record<string, unknown>) {}
}
