import { deepmergeCustom } from 'deepmerge-ts';

import type { DeepMergeLeafURI } from 'deepmerge-ts';

export const deepmerge = deepmergeCustom<{
  DeepMergeArraysURI: DeepMergeLeafURI;
}>({
  mergeArrays: false,
});