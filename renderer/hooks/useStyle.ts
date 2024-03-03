import { Accessor, createMemo } from 'solid-js';

import useThemeList from './useThemeList';
import useCurrent from './useCurrent';

import { DEFAULT_STYLE, PRESET_PREFIX } from '../../common/constants';

import presetThemes from '../../common/presets';

import type { StyleConfig } from '../../common/schema';

const useStyle = (name?: Accessor<string>): Accessor<StyleConfig> => {
  const [themeList] = useThemeList();
  const { themeName } = useCurrent();

  const style = createMemo(() => {
    const list = themeList();
    const targetName = name?.() ?? themeName();

    let result = list[targetName] ?? DEFAULT_STYLE;
    if (targetName.startsWith(PRESET_PREFIX)) {
      const presetName = targetName.replace(PRESET_PREFIX, '');
      result = presetThemes[presetName] ?? DEFAULT_STYLE;
    }

    return result;
  });

  return style;
};

export default useStyle;
