import { render } from 'solid-js/web';

import App from './App';

import Provider from '../Provider';

render(
  () => (
    <Provider>
      <App />
    </Provider>
  ),
  document.querySelector('#app')!,
);
