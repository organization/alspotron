import { Match, Switch as SwitchFlow } from 'solid-js';
import { Marquee } from '@suyongs/solid-utility';

import Selector from '../../components/Select';
import Switch from '../../components/Switch';

import type {
  ButtonOption,
  NumberOption,
  SelectOption,
  SettingOption,
} from '../../../common/plugins';

export interface SettingOptionRendererProps<Type> {
  option: SettingOption;

  value?: Type;
  onChange?: (value: Type) => void;
  onClick?: () => void;
}
export const SettingOptionRenderer = <Type,>(
  props: SettingOptionRendererProps<Type>,
) => {
  return (
    <>
      <div
        class={
          'w-[0] flex flex-col justify-center items-stretch flex-1 basis-[100%]'
        }
      >
        <Marquee class={'w-full'}>{props.option.name}</Marquee>
        <Marquee class={'text-gray-400'} gap={18}>
          {props.option.description}
        </Marquee>
      </div>
      <div class={'flex-1'} />
      <SwitchFlow>
        <Match when={props.option.type === 'select'}>
          <Selector
            options={(props.option as SelectOption).options.map(
              ({ value }) => value,
            )}
            value={props.value as string}
            onChange={(value) => props.onChange?.(value as Type)}
            format={(option) =>
              (props.option as SelectOption).options.find(
                (it) => it.value === option,
              )?.label ?? option
            }
          />
        </Match>
        <Match when={props.option.type === 'string'}>
          <input
            type={'text'}
            class={'input'}
            value={props.value as string}
            onChange={(event) => props.onChange?.(event.target.value as Type)}
          />
        </Match>
        <Match when={props.option.type === 'number'}>
          <input
            type={'number'}
            class={'input'}
            min={(props.option as NumberOption).min}
            max={(props.option as NumberOption).max}
            step={(props.option as NumberOption).step}
            value={props.value as string}
            onChange={(event) => props.onChange?.(event.target.value as Type)}
          />
        </Match>
        <Match when={props.option.type === 'boolean'}>
          <Switch
            value={props.value as boolean}
            onChange={(checked) => props.onChange?.(checked as Type)}
          />
        </Match>
        <Match when={props.option.type === 'button'}>
          <button
            classList={{
              'btn-primary':
                ((props.option as ButtonOption).variant ?? 'primary') ===
                'primary',
              'btn-secondary':
                (props.option as ButtonOption).variant === 'secondary',
              'btn-error': (props.option as ButtonOption).variant === 'error',
            }}
            onClick={() => props.onClick?.()}
          >
            {(props.option as ButtonOption).label}
          </button>
        </Match>
      </SwitchFlow>
    </>
  );
};
