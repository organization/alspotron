import { style } from '@vanilla-extract/css';
import { vars, alpha } from '@alspotron/ui/css-runtime';

import { darkTheme } from '../../../../index.css';

export const activeButtonStyle = style({
  backgroundColor: `${alpha(vars.color.gray[900], 0.3)} !important`,

  selectors: {
    [`.${darkTheme} &`]: {
      backgroundColor: `${alpha(vars.color.gray[100], 0.3)} !important`,
    },
  },
});

export const popupStyle = style({
  backgroundColor: vars.color.gray[100],
  overflow: 'auto',

  selectors: {
    [`.${darkTheme} &`]: {
      backgroundColor: vars.color.gray[950],
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});
