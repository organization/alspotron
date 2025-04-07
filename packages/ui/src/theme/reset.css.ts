import { globalStyle } from '@vanilla-extract/css';

import { resetLayer } from './layer.css';

globalStyle('*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) ', {
  '@layer': {
    [resetLayer]: {
      all: 'unset',
      display: 'revert',
    },
  },
});

globalStyle(`*, *::before, *::after`, {
  '@layer': {
    [resetLayer]: {
      boxSizing: 'border-box',
    },
  },
});

globalStyle('html', {
  '@layer': {
    [resetLayer]: {
      MozTextSizeAdjust: 'none',
      WebkitTextSizeAdjust: 'none',
      textSizeAdjust: 'none',
    },
  },
});

globalStyle('a, button', {
  '@layer': {
    [resetLayer]: {
      cursor: 'revert',
    },
  },
});

globalStyle('ol, ul, menu, summary', {
  '@layer': {
    [resetLayer]: {
      listStyle: 'none',
    },
  },
});

globalStyle('ol', {
  '@layer': {
    [resetLayer]: {
      counterReset: 'revert',
    },
  },
});

globalStyle('img', {
  '@layer': {
    [resetLayer]: {
      maxInlineSize: '100%',
      maxBlockSize: '100%',
    }
  },
});

globalStyle('table', {
  '@layer': {
    [resetLayer]: {
      borderCollapse: 'collapse',
    },
  },
});

globalStyle('input, textarea', {
  '@layer': {
    [resetLayer]: {
      WebkitUserSelect: 'auto',
    },
  },
});

globalStyle('textarea', {
  '@layer': {
    [resetLayer]: {
      whiteSpace: 'revert',
    },
  },
});

globalStyle('meter', {
  '@layer': {
    [resetLayer]: {
      WebkitAppearance: 'revert',
      appearance: 'revert',
    },
  },
});

globalStyle(':where(pre)', {
  '@layer': {
    [resetLayer]: {
      all: 'revert',
      boxSizing: 'border-box',
    },
  },
});

globalStyle('::placeholder', {
  '@layer': {
    [resetLayer]: {
      color: 'unset',
    },
  },
});

globalStyle(':where([hidden])', {
  '@layer': {
    [resetLayer]: {
      display: 'none',
    },
  },
});

globalStyle(':where([contenteditable]:not([contenteditable="false"]))', {
  '@layer': {
    [resetLayer]: {
      MozUserModify: 'read-write',
      WebkitUserModify: 'read-write',
      overflowWrap: 'break-word',
      // after-white-space is not typed
      WebkitLineBreak: 'after-white-space' as unknown as undefined,
      WebkitUserSelect: 'auto',
    },
  },
});

globalStyle(':where([draggable="true"])', {
  '@layer': {
    [resetLayer]: {
      // @ts-ignore: WebkitUserDrag is not a standard property
      WebkitUserDrag: 'element',
    },
  },
});

globalStyle(':where(dialog:modal)', {
  '@layer': {
    [resetLayer]: {
      all: 'revert',
      boxSizing: 'border-box',
    },
  },
});

globalStyle('::-webkit-details-marker', {
  '@layer': {
    [resetLayer]: {
      display: 'none',
    },
  },
});
