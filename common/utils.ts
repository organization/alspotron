/**
 * @deprecated use PlayingInfo::id
 * @description FIXME SourceProviders already calculate their ids.
 *    And using this can lead to bug when SourceProviders change their id scheme.
 */
export const getLyricMapperId = (title: string, coverUrl: string | null = 'unknown') => `${title}:${coverUrl ?? 'unknown'}`;
