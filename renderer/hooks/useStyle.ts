import { Accessor, createMemo } from 'solid-js';

import useConfig from './useConfig';
import useThemeList from './useThemeList';

import { DEFAULT_STYLE } from '../../common/constants';

import type { StyleConfig } from '../../common/types';

const useStyle = (): Accessor<StyleConfig> => {
  const [config] = useConfig();
  const [themeList] = useThemeList();

  const style = createMemo(() => {
    const list = themeList();
    const configData = config();

    return (
      list[configData?.selectedTheme ?? '']
        // ?? configData?.style
        ?? DEFAULT_STYLE
    );
  });

  return style;
};

export default useStyle;
