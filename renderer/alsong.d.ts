declare module 'alsong' {
  import * as stream from 'stream';

  type LyricTimestamp = number;
  type LyricRegister = {
    name: string,
    email: string,
    url: string,
    phone: string,
    comment: string
  };

  type Lyric = {
    lyricId: number,
    title: string,
    artist: string,
    album: string,
    lyric: Record<LyricTimestamp, string[]>,
    lyricRaw: string,
    firstRegister: LyricRegister,
    register: LyricRegister
  };

  type LyricMetadata = {
    lyricId: number,
    playtime: number,
    title: string,
    artist: string,
    album: string,
    registerDate: Date
  };

  type AlsongMusic = stream | Buffer | string;

  type AlsongOption = {
    playtime?: number;
    page?: number;
  };

  type LyricCompat = {
    strInfoID: string,
    strOnlyLyricWord: string,
    strTitle: string,
    strLyric: string,
    strArtistName: string,
    strAlbumName: string,
    strRegisterFirstName: string,
    strRegisterFirstEMail: string,
    strRegisterFirstURL: string,
    strRegisterFirstPhone: string,
    strRegisterFirstComment: string,
    strRegisterName: string,
    strRegisterEMail: string,
    strRegisterURL: string,
    strRegisterPhone: string,
    strRegisterComment: string,
    lyric: Record<LyricTimestamp, string[]>;
  };

  interface AlsongCompat {
    (artist: string, title: string, parseLyric?: boolean): Promise<LyricCompat[]>;

    (music: AlsongMusic, parseLyric?: boolean): Promise<LyricCompat | null>;

    getHash(music: AlsongMusic): Promise<string>;
  }

  interface Alsong {
    (artist: string, title: string, option?: AlsongOption): Promise<LyricMetadata[]>;

    (music: AlsongMusic): Promise<Lyric | null>;

    getHash(music: AlsongMusic): Promise<string>;

    getLyric(music: AlsongMusic): Promise<Lyric | null>;

    getLyricById(lyricId: number | string): Promise<Lyric | null>;

    getLyricByHash(hash: string): Promise<Lyric | null>;

    getLyricListByArtistName(artist: string, title: string, option?: AlsongOption): Promise<LyricMetadata[]>;

    compat(resolver?: 'v1' | 'v2'): AlsongCompat;
  }

  const alsong: Alsong;

  export default alsong;
}
