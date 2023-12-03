import { JSX } from 'solid-js';
import { TransProvider } from '@jellybrick/solid-i18next';

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
      {props.children}
    </TransProvider>
  );
};

export default Provider;
