import { createEffect, on, onMount } from 'solid-js';

import usePlugins from './usePlugins';

const usePluginsCSS = () => {
  const { plugins } = usePlugins();

  const injectStyleSheet = () => {
    plugins().forEach((plugin) => {
      if (plugin.state !== 'enable') return;

      const id = `plugin-${plugin.id}`;
      const css = plugin.css?.join('\n');

      if (!css) return;

      const style = document.querySelector(`#${id}`) ?? document.createElement('style');
      style.id = id;
      style.innerHTML = css;
      
      if (!style.isConnected) document.head.appendChild(style);
    });
  };

  onMount(() => injectStyleSheet());
  createEffect(on(() => plugins(), injectStyleSheet));
};

export default usePluginsCSS;
