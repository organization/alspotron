import { splitProps, ValidComponent } from 'solid-js';

import { BoxProps } from '../Box';

import { containerStyle, inputStyle, thumbStyle } from './Switch.css';

export type SwitchProps<T extends ValidComponent = 'input'> = Omit<BoxProps<T>, 'checked' | 'onChange'> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};
export const Switch = <T extends ValidComponent = 'input'>(props: SwitchProps<T>) => {
  const [local, inputProps] = splitProps(
    props,
    ['checked', 'onChange'],
  );

  return (
    <label
      classList={{
        [containerStyle.on]: local.checked,
        [containerStyle.off]: !local.checked,
      }}
    >
      <input
        {...inputProps}
        type={'checkbox'}
        checked={local.checked}
        onChange={(e) => {
          if (local.onChange) {
            local.onChange(e.currentTarget.checked);
          }
        }}
        class={inputStyle}
      />
      <div
        classList={{
          [thumbStyle.on]: local.checked,
          [thumbStyle.off]: !local.checked,
        }}
      />
    </label>
  )
};
