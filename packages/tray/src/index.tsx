import { render } from 'solid-js/web';

import { App } from './App';
import { ThemeProvider } from '@alspotron/ui';
import { darkTheme, lightTheme } from './index.css';

import '@alspotron/ui/style.css';
import 'material-symbols/rounded.css';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';

render(
  () => (
    <ThemeProvider
      dark={darkTheme}
      light={lightTheme}
    >
      <App/>
    </ThemeProvider>
  ),
  document.querySelector('#app')!,
);
