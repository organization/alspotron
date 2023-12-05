export const getLyricMapperId = (title: string, coverUrl: string | null = 'unknown') => `${title}:${coverUrl ?? 'unknown'}`;
