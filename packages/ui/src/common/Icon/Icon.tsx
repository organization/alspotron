import { splitProps, ValidComponent } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { Box, BoxProps } from '../Box';
import { cx, sx } from '../../helper';

import { fill, grade, iconStyle, opticalSize, weight } from './Icon.css';

export type IconProps<T extends ValidComponent> = BoxProps<T> & {
  name: string;

  /**
   * @default false
   */
  fill?: boolean;
  /**
   * @value 100-900
   * @default 400
   */
  weight?: number;
  /**
   * @value -25-200
   * @default 0
   */
  grade?: number;
  /**
   * @value 20-48
   * @default 24
   */
  opticalSize?: number;
};
export const Icon = <T extends ValidComponent = 'span'>(props: IconProps<T>) => {
  const [local, rest] = splitProps(
    props,
    ['name', 'fill', 'weight', 'grade', 'opticalSize'],
  );

  return (
    <Box
      {...rest}
      as={rest.as ?? 'span'}
      class={cx(iconStyle, 'material-symbols-rounded')}
      style={sx(rest.style, assignInlineVars({
        [fill]: local.fill ? '1' : '0',
        [weight]: local.weight,
        [grade]: local.grade,
        [opticalSize]: local.opticalSize,
      }))}
    >
      {local.name}
    </Box>
  );
};
