import { Accessor, createMemo, on } from 'solid-js';

import useConfig from './useConfig';

import { DEFAULT_STYLE } from '../../common/constants';

import type { StyleConfig } from '../../common/config';

const useStyle = (): Accessor<StyleConfig> => {
  const [config] = useConfig();

  const style = createMemo(on(config, (configData) => (
    configData?.themes[configData?.selectedTheme ?? '']
      ?? configData?.style
      ?? DEFAULT_STYLE
  )));

  return style;
};

export default useStyle;
