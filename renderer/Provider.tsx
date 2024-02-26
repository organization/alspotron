import { createRenderEffect, JSX } from 'solid-js';
import { TransProvider } from '@jellybrick/solid-i18next';

import useConfig from './hooks/useConfig';

import { LangResource } from '../common/intl';

export interface ProviderProps {
  children: JSX.Element;
}

const Provider = (props: ProviderProps) => {
  const [config] = useConfig();

  console.log('provider?');
  createRenderEffect(() => {
    const theme = config()?.appTheme;

    console.log('theme', theme, window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.dataset.colorScheme = 'dark';
    } else {
      document.body.dataset.colorScheme = 'light';
    }
  });

  return (
    <TransProvider
      options={{
        resources: LangResource,
        lng: config()?.language
      }}
    >
      {props.children}
    </TransProvider>
  );
};

export default Provider;
