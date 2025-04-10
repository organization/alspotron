import { Box, Text, Select, themeMode, setThemeMode, Button } from '@alspotron/ui';

import { SettingItem } from '../../components/SettingItem';
import { SettingGroup } from '../../components/SettingGroup';

export const GeneralPage = () => {
  return (
    <Box p={'xl'} gap={'xl'}>
      <Text variant={'h2'}>
        일반
      </Text>
      <SettingGroup
        name={'일반 설정'}
      >
        <SettingItem
          icon={'language'}
          name={'언어 설정'}
          description={'Alspotron의 언어를 설정합니다.'}
        >
          <Select
            type={'default'}
            value={'ko-KR'}
            data={[
              { label: '한국어', value: 'ko-KR' },
              { label: 'English', value: 'en-US' },
            ]}
          />
        </SettingItem>
        <SettingItem
          icon={'podcasts'}
          name={'방송 설정'}
          description={'OBS Studio와 같은 방송용 소프트웨어에서 Alspotron창을 캡쳐할 수 있도록 설정합니다.'}
        >
        </SettingItem>
        <SettingItem
          icon={'palette'}
          name={'앱 테마'}
          description={'Alspotron의 테마를 설정합니다.'}
        >
          <Select
            type={'default'}
            value={themeMode()}
            onChange={setThemeMode}
            data={[
              { icon: 'contrast', label: '시스템', value: 'system' },
              { icon: 'dark_mode', label: '다크 모드', value: 'dark' },
              { icon: 'light_mode', label: '라이트 모드', value: 'light' },
            ]}
          />
        </SettingItem>
      </SettingGroup>

      <SettingGroup name={'제공자'}>
        <SettingItem
          icon={'music_note'}
          name={'Now Playing 제공자'}
          description={'어떤 음악이 재생 중인지 Alspotron에게 알려주는 제공자를 설정합니다.'}
        >
          <Select
            type={'default'}
            value={'tuna-obs'}
            data={[
              { label: 'Tuna OBS', value: 'tuna-obs' },
              { label: 'Web Now Playing', value: 'web-now-playing' },
            ]}
          />
        </SettingItem>
        <SettingItem
          icon={'lyrics'}
          name={'가사 제공자'}
          description={'인식된 음악으로부터 가사를 가져올때, 어떤 곳에서 가사를 가져올지 설정합니다.'}
        >
          <Select
            type={'default'}
            value={'alsong'}
            data={[
              { label: 'Alsong', value: 'alsong' },
              { label: 'LRCLIB', value: 'lrclib' },
            ]}
          />
        </SettingItem>
      </SettingGroup>
      <SettingGroup name={'특수 설정'}>
        <SettingItem
          icon={'sync_problem'}
          name={'전체 초기화'}
          description={'모든 설정과 테마를 초기화합니다.'}
        >
          <Button>
            초기화
          </Button>
        </SettingItem>
        <SettingItem
          icon={'reset_wrench'}
          name={'설정 초기화'}
          description={'설정을 초기화합니다.'}
        >
          <Button>
            초기화
          </Button>
        </SettingItem>
        <SettingItem
          icon={'reset_brightness'}
          name={'테마 초기화'}
          description={'설정을 초기화합니다.'}
        >
          <Button>
            초기화
          </Button>
        </SettingItem>
      </SettingGroup>
    </Box>
  );
};
