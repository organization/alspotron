import { globalStyle } from '@vanilla-extract/css';

import { alphaChannel } from './layer.css';

globalStyle('html, body, #app', {
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',

  vars: {
    [alphaChannel]: 'l c h',
  },
});

globalStyle('html', {
  fontSize: '10px',
});

globalStyle(':where(*)', {
  fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  fontSize: '1.6rem',
});
