import { Accessor, createMemo } from 'solid-js';

import useConfig from './useConfig';
import useThemeList from './useThemeList';

import { DEFAULT_STYLE, PRESET_PREFIX } from '../../common/constants';

import presetThemes from '../../common/presets';

import type { StyleConfig } from '../../common/schema';

const useStyle = (): Accessor<StyleConfig> => {
  const [config] = useConfig();
  const [themeList] = useThemeList();

  const style = createMemo(() => {
    const list = themeList();
    const configData = config();

    let result = list[configData?.selectedTheme ?? ''] ?? DEFAULT_STYLE;
    if (configData?.selectedTheme.startsWith(PRESET_PREFIX)) {
      const name = configData?.selectedTheme.replace(PRESET_PREFIX, '');
      result = presetThemes[name] ?? DEFAULT_STYLE;
    }

    return result;
  });

  return style;
};

export default useStyle;
