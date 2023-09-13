export interface UpdateData {
  status: string;
  title?: string;
  artists?: string[];
  progress?: number;
  duration?: number;
  cover_url?: string;
  lyrics?: Record<number, string[]>;
}

export interface RequestBody {
  data: UpdateData;
}
