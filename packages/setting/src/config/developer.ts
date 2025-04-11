import { SettingGroup } from './types.ts';

export const DeveloperSetting: SettingGroup[] = [
  {
    name: '개발자 콘솔',
    items: [
      {
        type: 'button',
        name: '고급 검색 창',
        buttonName: '콘솔 열기',
        onClick: () => {},
      },
      {
        type: 'button',
        name: '설정 창',
        buttonName: '콘솔 열기',
        onClick: () => {},
      },
      {
        type: 'button',
        name: '트레이 창',
        buttonName: '콘솔 열기',
        onClick: () => {},
      },
    ],
  },
  {
    name: '실험적 기능',
    items: [
      {
        type: 'button',
        name: '구버전 설정 가져오기',
        description: '0.24.2 이하 버전의 설정을 가져옵니다.',
        buttonName: '설정 가져오기',
        onClick: () => {},
      },
    ],
  },
];
