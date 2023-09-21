import { JSX } from 'solid-js';
import { TransProvider } from '@jellybrick/solid-i18next';

import { Router, hashIntegration } from '@solidjs/router';

import { LangResource } from '../../common/intl';
import useConfig from '../hooks/useConfig';

export interface ProviderProps {
  children: JSX.Element;
}

const Provider = (props: ProviderProps) => {
  const [config] = useConfig();

  return (
    <TransProvider
      options={{
        resources: LangResource,
        lng: config()?.language
      }}
    >
      <Router source={hashIntegration()}>
        {props.children}
      </Router>
    </TransProvider>
  );
};

export default Provider;
