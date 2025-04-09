import { style } from '@vanilla-extract/css';
import { vars } from '@alspotron/ui/css-runtime';

import { darkTheme } from '../../../../index.css';

export const popupStyle = style({
  backgroundColor: vars.color.gray[50],

  selectors: {
    [`.${darkTheme} &`]: {
      backgroundColor: vars.color.gray[950],
    },
  },
});
