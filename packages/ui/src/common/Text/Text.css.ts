import { styleVariants } from '@vanilla-extract/css';
import { vars } from '../../theme';

export const textStyle = styleVariants({
  h1: {
    fontSize: '3.2rem',
    fontWeight: 'bold',
  },
  h2: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
  },
  h3: {
    fontSize: '2.0rem',
    fontWeight: 'bold',
  },

  title: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
  },
  body: {
    fontSize: '1.4rem',
    fontWeight: '400',
  },
  caption: {
    fontSize: '1.2rem',
    fontWeight: '400',
    color: vars.color.gray[400],
  },
});
