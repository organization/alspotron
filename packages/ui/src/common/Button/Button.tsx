import { splitProps, ValidComponent } from 'solid-js';

import { cx } from '../../helper';

import { Box, BoxProps } from '../Box';

import { buttonStyle } from './Button.css';

type ButtonVariants = keyof typeof buttonStyle
export type ButtonProps<T extends ValidComponent = 'button'> = BoxProps<T> & {
  variant?: ButtonVariants;
};
export const Button = <T extends ValidComponent = 'button'>(
  props: ButtonProps<T> & { as?: T }
) => {
  const [local, rest] = splitProps(
    props,
    ['variant']
  );

  return (
    <Box
      {...rest}
      size={rest.size ?? '1.4rem'}
      as={rest.as ?? 'button'}
      direction={rest.direction ?? 'row'}
      class={cx(buttonStyle[local.variant ?? 'default'], rest.class)}
    />
  );
};
