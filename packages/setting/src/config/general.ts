import { SettingGroup } from './types';

export const GeneralSetting: SettingGroup[] = [
  {
    name: '일반 설정',
    items: [
      {
        type: 'select',
        icon: 'language',
        name: '언어 설정',
        description: 'Alspotron의 언어를 설정합니다.',
        value: (config) => config?.language ?? 'ko',
        onChange: (value, setter) => setter(
          {
            language: value as 'ko' | 'en' | 'ja' | 'de',
          },
        ),
        data: [
          { label: '한국어', value: 'ko' },
          { label: 'English', value: 'en' },
          { label: '日本語', value: 'ja' },
          { label: 'Deutsch', value: 'de' },
        ],
      },
      {
        type: 'switch',
        icon: 'podcasts',
        name: '방송 설정',
        description: 'OBS Studio와 같은 방송용 소프트웨어에서 Alspotron창을 캡쳐할 수 있도록 설정합니다.',
        checked: (config) => config?.streamingMode ?? false,
        onChange: (value, setter) => setter({
          streamingMode: value as boolean,
        }),
      },
      {
        type: 'select',
        icon: 'palette',
        name: '앱 테마',
        description: 'Alspotron의 테마를 설정합니다.',
        value: (config) => config?.appTheme ?? 'system',
        onChange: (value, setter) => setter({
          appTheme: value as 'system' | 'dark' | 'light',
        }),
        data: [
          { icon: 'contrast', label: '시스템', value: 'system' },
          { icon: 'dark_mode', label: '다크 모드', value: 'dark' },
          { icon: 'light_mode', label: '라이트 모드', value: 'light' },
        ],
      }
    ],
  },
  {
    name: '제공자',
    items: [
      {
        type: 'select',
        icon: 'music_note',
        name: 'Now Playing 제공자',
        description: '어떤 음악이 재생 중인지 Alspotron에게 알려주는 제공자를 설정합니다.',
        value: (config) => config?.sourceProvider ?? 'tuna-obs',
        onChange: (value, setter) => setter({
          sourceProvider: value as 'tuna-obs' | 'web-now-playing',
        }),
        data: [
          { label: 'Tuna OBS', value: 'tuna-obs' },
          { label: 'Web Now Playing', value: 'web-now-playing' },
        ],
        items: [
          {
            type: 'input',
            name: '포트',
            icon: '123',
            description: 'Tuna OBS의 포트를 설정합니다.',
            placeholder: '기본값 1608',
            value: () => '1608',
            onChange: () => {
              // TODO
            },
          },
          {
            type: 'input',
            name: '보간 시간',
            icon: 'search_activity',
            description: 'Tuna OBS로부터 음악 정보를 가져올때, 얼마나 자주 가져올지 설정합니다.',
            placeholder: '기본값 3000ms',
            value: () => '3000',
            onChange: () => {
              // TODO
            },
          },
        ],
      },
      {
        type: 'select',
        icon: 'lyrics',
        name: '가사 제공자',
        description: '인식된 음악으로부터 가사를 가져올때, 어떤 곳에서 가사를 가져올지 설정합니다.',
        value: (config) => config?.lyricProvider ?? 'alsong',
        onChange: (value, setter) => setter({
          lyricProvider: value as 'alsong' | 'lrclib',
        }),
        data: [
          { label: 'Alsong', value: 'alsong' },
          { label: 'LRCLIB', value: 'lrclib' },
        ],
      },
    ],
  },
  {
    name: '기타',
    items: [
      {
        type: 'button',
        icon: 'sync_problem',
        name: '전체 초기화',
        description: '모든 설정과 테마를 초기화합니다.',
        onClick: () => {
          // TODO
        },
      },
      {
        type: 'button',
        icon: 'reset_wrench',
        name: '설정 초기화',
        description: '설정을 초기화합니다.',
        onClick: () => {
          // TODO
        },
      },
      {
        type: 'button',
        icon: 'reset_brightness',
        name: '테마 초기화',
        description: '설정을 초기화합니다.',
        onClick: () => {
          // TODO
        },
      },
    ],
  },
];
