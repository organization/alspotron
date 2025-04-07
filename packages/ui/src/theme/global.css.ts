import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body, #root', {
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
});

globalStyle('html', {
  fontSize: '10px',
});

globalStyle(':where(*)', {
  fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  fontSize: '1.6rem',
});
