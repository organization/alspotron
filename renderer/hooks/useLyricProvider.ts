import { Accessor } from 'solid-js';

import alsong from 'alsong';

import { AlsongLyricProvider, BaseLyricProvider, LyricProviderKind } from '../../common/provider';

const instanceMap = new Map<LyricProviderKind, BaseLyricProvider>();
instanceMap.set('alsong', new AlsongLyricProvider(alsong));

const type = 'alsong';
export const useLyricProvider = (): Accessor<BaseLyricProvider | null> => () => instanceMap.get(type) ?? null;
