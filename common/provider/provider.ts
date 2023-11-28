import { AlsongLyricProvider } from './alsong';

export const LyricProviderList = [
  AlsongLyricProvider,
] as const;

export type LyricProviderKind = typeof LyricProviderList[number]['provider'];
export type LyricProvider = typeof LyricProviderList[number];

export const getLyricProvider = (provider: LyricProviderKind): LyricProvider | undefined => {
  return LyricProviderList.find((v) => v.provider === provider);
};
