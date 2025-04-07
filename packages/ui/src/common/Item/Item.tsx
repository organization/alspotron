import { Show, splitProps, ValidComponent } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { JSX } from 'solid-js/jsx-runtime';

import { ItemGroup } from './ItemGroup';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { BoxProps } from '../Box';

import { ColorMapKey, colors } from '../../theme';

import {
  clickableContainerStyle,
  containerStyle,
  disabledStyle,
  hoverBackgroundStyle,
  textGroupStyle,
  textStyle
} from './Item.css';

export type ItemProps<T extends ValidComponent> = BoxProps<T> & {
  name?: string;
  description?: string;

  leftIcon?: string;
  rightIcon?: string;
  left?: JSX.Element;
  right?: JSX.Element;

  disabled?: boolean;
  clickable?: boolean | ColorMapKey;
  tooltip?: string;
};
export const Item = <T extends ValidComponent = 'li'>(props: ItemProps<T>) => {
  const [
    textProps,
    itemProps,
    localProps,
    rest,
  ] = splitProps(
    props,
    ['name', 'description', 'tooltip'],
    ['leftIcon', 'rightIcon', 'left', 'right'],
    ['clickable'],
  );

  const hoverBackgroundColor = () => {
    if (typeof localProps.clickable !== 'string') return null;

    return colors[localProps.clickable];
  };

  return (
    <Tooltip
      enabled={typeof textProps.tooltip === 'string'}
      label={textProps.tooltip}
    >
      <li
        {...rest}
        classList={{
          ...rest.classList,
          [rest.class]: !!rest.class,
          [containerStyle]: true,
          [clickableContainerStyle]: localProps.clickable ?? rest.onClick,
          [disabledStyle]: rest.disabled,
        }}
        style={assignInlineVars({
          [hoverBackgroundStyle]: hoverBackgroundColor(),
        })}
      >
        <Show when={itemProps.left}>
          {itemProps.left}
        </Show>
        <Show when={itemProps.leftIcon}>
          {(icon) => <Icon name={icon()}/>}
        </Show>
        <div class={textGroupStyle}>
          <Show when={textProps.name}>
            <div class={textStyle.default}>
              {textProps.name}
            </div>
          </Show>
          <Show when={textProps.description}>
            <div class={textStyle.caption}>
              {textProps.description}
            </div>
          </Show>
        </div>
        <Show when={itemProps.rightIcon}>
          {(icon) => <Icon name={icon()}/>}
        </Show>
        <Show when={itemProps.right}>
          {itemProps.right}
        </Show>
      </li>
    </Tooltip>
  );
};
Item.Group = ItemGroup;
