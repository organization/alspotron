import { deepmergeCustom } from 'deepmerge-ts';

export const deepmerge = deepmergeCustom({
  mergeArrays: false,
});
