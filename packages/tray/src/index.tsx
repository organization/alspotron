import { render } from 'solid-js/web';

import { App } from './App';
import { ThemeProvider } from '@alspotron/ui';

import '@alspotron/ui/style.css';

render(
  () => (
    <ThemeProvider>
      <App/>
    </ThemeProvider>
  ),
  document.querySelector('#app')!,
);
