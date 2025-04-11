import { Match, Switch as FlowSwitch } from 'solid-js';
import { Button, Select, Switch, TextInput } from '@alspotron/ui';

import {
  ButtonSettingItem,
  SelectSettingItem,
  SettingItem as SettingItemType,
  SwitchSettingItem,
  TextInputSettingItem
} from '../../config';
import { useConfig } from '../../hooks/useConfig';

export type SettingActionProps = SettingItemType;
export const SettingAction = (props: SettingActionProps) => {
  const [config, setConfig] = useConfig();

  return (
    <FlowSwitch>
      <Match when={props.type === 'select'}>
        <Select
          type={'default'}
          value={(props as SelectSettingItem).value(config())}
          onChange={(value: string | null) => {
            console.log('select', value);
            (props as SelectSettingItem).onChange(value, setConfig);
          }}
          data={(props as SelectSettingItem).data}
        />
      </Match>
      <Match when={props.type === 'switch'}>
        <Switch
          type={'default'}
          checked={(props as SwitchSettingItem).checked(config())}
          onChange={(checked: boolean) => (props as SwitchSettingItem).onChange(checked, setConfig)}
        />
      </Match>
      <Match when={props.type === 'button'}>
        <Button
          variant={(props as ButtonSettingItem).variant}
          onClick={(props as ButtonSettingItem).onClick}
        >
          {(props as ButtonSettingItem).name}
        </Button>
      </Match>
      <Match when={props.type === 'input'}>
        <TextInput
          placeholder={(props as TextInputSettingItem).placeholder}
          value={(props as TextInputSettingItem).value(config())}
          onChange={(event) => {
            (props as TextInputSettingItem).onChange(event.currentTarget.value, setConfig);
          }}
        >
          {(props as TextInputSettingItem).name}
        </TextInput>
      </Match>
    </FlowSwitch>
  );
};