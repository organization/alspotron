import { style } from '@vanilla-extract/css';

import { vars } from '../../theme';

export const itemGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  flexShrink: 0,

  padding: vars.space.xs,
  borderRadius: vars.space.sm,
  overflow: 'hidden',

  selectors: {
    '&:has( + [data-item-group])': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    '[data-item-group] + &': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTopStyle: 'solid',
      borderTopWidth: vars.line.md,
      borderTopColor: vars.color.gray['200'],
    }
  }
});
