import { ButtonProps, SelectItemProps } from '@alspotron/ui';
import { PartialDeep } from 'type-fest';

import { SettingItemProps } from '../components/SettingItem';

import type { Config } from '../../../../common/schema';

type BaseSettingItem = Omit<SettingItemProps, 'children' | 'items'> & {
  items?: SettingItem[];
};
export type SelectSettingItem = BaseSettingItem & {
  type: 'select';
  value: (config: Config | null) => string;
  onChange: (value: unknown, setter: (data: PartialDeep<Config>) => void) => void;
  data: SelectItemProps[];
};
export type SwitchSettingItem = BaseSettingItem & {
  type: 'switch';
  checked: (config: Config | null) => boolean;
  onChange: (checked: boolean, setter: (data: PartialDeep<Config>) => void) => void;
};
export type ButtonSettingItem = BaseSettingItem & {
  type: 'button';
  variant?: ButtonProps['variant'];
  buttonName: string;
  onClick: () => void;
};
export type TextInputSettingItem = BaseSettingItem & {
  type: 'input',
  placeholder?: string;
  value: (config: Config | null) => string;
  onChange: (value: string, setter: (data: PartialDeep<Config>) => void) => void;
};
export type SettingItem = SelectSettingItem | SwitchSettingItem | ButtonSettingItem | TextInputSettingItem;
export type SettingGroup = {
  name: string;
  description?: string;
  items: SettingItem[];
};
