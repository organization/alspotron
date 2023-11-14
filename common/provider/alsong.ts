import { LyricData, LyricMetadata, BaseLyricProvider, SearchParams } from './types';

import type {
  Alsong,
  LyricMetadata as AlsongLyricMetadata,
  Lyric as AlsongLyric
} from 'alsong';


const convertLyricMetadata = (metadata: AlsongLyricMetadata): LyricMetadata => {
  return {
    id: metadata.lyricId.toString(),
    title: metadata.title,
    album: metadata.album,
    artist: metadata.artist,
    playtime: metadata.playtime,
    registerDate: metadata.registerDate,
  }
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
  }
}

export class AlsongLyricProvider extends BaseLyricProvider {
  public static readonly provider = 'alsong';

  private alsong: Alsong;

  constructor(alsong: Alsong) {
    super();
    this.alsong = alsong;
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

    const result = await this.alsong(artist, title, { playtime: params.playtime }).catch(() => []);
    return result.map(convertLyricMetadata);
  }
}
