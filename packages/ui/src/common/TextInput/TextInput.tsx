import { Match, splitProps, Switch, ValidComponent } from 'solid-js';

import { Icon } from '../Icon';
import { Box, BoxProps } from '../Box';

import { containerStyle, inputStyle } from './TextInput.css';
import type { JSX } from 'solid-js/jsx-runtime';

export type TextInputProps<T extends ValidComponent = 'input'> = BoxProps<T> & {
  left?: JSX.Element | string;
  right?: JSX.Element | string;
};
export const TextInput = <T extends ValidComponent = 'input'>(props: TextInputProps<T>) => {
  const [local, inputProps] = splitProps(
    props,
    ['left', 'right'],
  );

  return (
    <Box class={containerStyle.default}>
      <Switch>
        <Match when={typeof local.left === 'string'}>
          <Icon name={local.left} size={'1.8rem'}/>
        </Match>
        <Match when={typeof local.left !== 'string'}>
          {local.left}
        </Match>
      </Switch>
      <input
        {...inputProps}
        class={inputStyle}
      />
      <Switch>
        <Match when={typeof local.right === 'string'}>
          <Icon name={local.right} size={'1.8rem'}/>
        </Match>
        <Match when={typeof local.right !== 'string'}>
          {local.right}
        </Match>
      </Switch>
    </Box>
  );
};
