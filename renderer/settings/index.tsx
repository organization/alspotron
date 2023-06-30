import { render } from 'solid-js/web';

import App from './App';

render(
  App,
  document && document.querySelector('#app'),
);
