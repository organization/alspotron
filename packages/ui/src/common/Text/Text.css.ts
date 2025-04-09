import { styleVariants } from '@vanilla-extract/css';
import { vars } from '../../theme';

export const textStyle = styleVariants({
  h1: {
    fontSize: '3.2rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },
  h2: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },
  h3: {
    fontSize: '2.0rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },

  title: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },
  body: {
    fontSize: '1.4rem',
    fontWeight: '400',
    color: vars.role.text.default,
  },
  caption: {
    fontSize: '1.2rem',
    fontWeight: '400',
    color: vars.role.text.caption,
  },
});
