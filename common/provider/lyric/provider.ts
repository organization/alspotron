import { AlsongLyricProvider } from './alsong';
import { LrclibLyricProvider } from './lrclib';

export const LyricProviderList = [
  AlsongLyricProvider,
  LrclibLyricProvider,
] as const;

export type LyricProviderKind = typeof LyricProviderList[number]['provider'];
export type LyricProvider = typeof LyricProviderList[number];

export const getLyricProvider = (provider: LyricProviderKind): LyricProvider | undefined => {
  return LyricProviderList.find((v) => v.provider === provider);
};
