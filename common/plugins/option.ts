interface BaseSettingOption {
  key: string;
  name: string;
  description?: string;
}
export interface SelectOption extends BaseSettingOption {
  type: 'select';
  options: {
    label: string;
    value: string;
  }[];
  default?: string;
}
export interface StringOption extends BaseSettingOption {
  type: 'string';
  default?: string;
}
export interface NumberOption extends BaseSettingOption {
  type: 'number';
  default?: number;
}
export interface BooleanOption extends BaseSettingOption {
  type: 'boolean';
  default?: boolean;
}
export interface ButtonOption extends BaseSettingOption {
  type: 'button';
  label?: string;
  variant?: 'primary' | 'secondary' | 'error';
  onClick?: () => void;
  default?: never;
}
export interface LabelOption extends BaseSettingOption {
  type: 'label';
  default?: never;
}

export type SettingOption = SelectOption | StringOption | NumberOption | BooleanOption | ButtonOption | LabelOption;
