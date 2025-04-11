import { SettingGroup } from './types.ts';

export const ViewSetting: SettingGroup[] = [
  {
    name: '뷰어 목록',
    items: [
      {
        type: 'switch',
        name: '뷰어 1',
        description: '적용된 테마: 테마 1',
        checked: () => true,
        onChange: () => {},
      },
      {
        type: 'switch',
        name: '뷰어 2',
        description: '적용된 테마: 아무튼 적용됨',
        checked: () => true,
        onChange: () => {},
      },
    ],
  },
  {
    name: '테마 목록',
    items: [
      {
        type: 'button',
        name: '테마 1',
        buttonName: '테마 편집',
        onClick: () => {},
      },
      {
        type: 'button',
        name: '테마 2',
        buttonName: '테마 편집',
        onClick: () => {},
      },
      {
        type: 'button',
        name: '테마 3',
        buttonName: '테마 편집',
        onClick: () => {},
      },
    ],
  },
];
