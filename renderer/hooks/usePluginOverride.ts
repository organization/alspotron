import usePlugins from './usePlugins';

import { OverrideMap, OverrideParameterMap } from '../../common/plugin';

const usePluginOverride = async <Target extends keyof OverrideMap>(
  target: Target,
  originalFn: (...args: OverrideParameterMap[Target]) => Promise<void> | void,
  ...args: OverrideParameterMap[Target]
): Promise<void> => {
  const { plugins } = usePlugins();

  const isEnabled = plugins().some((plugin) => plugin.state === 'enable');
  if (isEnabled) {
    const result = await window.ipcRenderer.invoke('override-plugin', target, ...args) as false | OverrideParameterMap[Target];
    
    if (result !== false) await originalFn(...result);
  } else {
    await originalFn(...args);
  }
};

export default usePluginOverride;
