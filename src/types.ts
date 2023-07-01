export interface TunaOBSPayload {
  title: string;
  artist: string;
  progress: number;
  duration: number;
  lyric?: {
    timestamp: string[];
    lyric: {
      [key: string]: string[];
    };
    current?: string[];
  };
  coverUrl: string;
}

export interface RequestBody {
  data: {
    status: string;
    title: string;
    artists: string[];
    progress: number;
    duration: number;
    cover_url: string;
    lyrics: {
      [key: string]: string[];
    }
  }
}