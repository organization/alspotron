import { render } from 'solid-js/web';

import { App } from './App';
import { ThemeProvider, isDarkTheme } from '@alspotron/ui';
import { Window } from '@alspotron/shared/renderer';

import { darkTheme, lightTheme } from './index.css';

import '@alspotron/ui/style.css';
import 'material-symbols/rounded.css';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';

render(
  () => (
    <Window dark={isDarkTheme()}>
      <ThemeProvider
        dark={darkTheme}
        light={lightTheme}
      >
        <App/>
      </ThemeProvider>
    </Window>
  ),
  document.querySelector('#app')!,
);
