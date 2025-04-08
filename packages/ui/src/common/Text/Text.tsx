import { splitProps, ValidComponent } from 'solid-js';

import { cx } from '../../helper';

import { Box, BoxProps } from '../Box';

import { textStyle } from './Text.css';

type TextVariants = keyof typeof textStyle
export type TextProps<T extends ValidComponent = 'div'> = BoxProps<T> & {
  variant?: TextVariants;
};
export const Text = <T extends ValidComponent = 'div'>(
  props: TextProps<T> & { as?: T }
) => {
  const [local, rest] = splitProps(
    props,
    ['variant']
  );

  return (
    <Box
      {...rest}
      class={cx(textStyle[local.variant ?? 'body'], rest.class)}
    />
  );
};
