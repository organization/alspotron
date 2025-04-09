import { Button, Box, Icon, TextInput } from '@alspotron/ui';

import { DevtoolButton } from './components/DevtoolButton';
import { Header } from '../../components/Header';

import { toolContainerStyle, toolStyle } from './MainPage.css';
import { Show } from 'solid-js';
import { useConfig } from '../../hooks/useConfig.ts';

export const MainPage = () => {
  const [config] = useConfig();

  return (
    <Box h={'100%'} p={'md'} gap={'sm'}>
      <Header>
        <Button variant={'icon'}>
          <Icon name={'power_settings_new'} size={'1.8rem'}/>
        </Button>
      </Header>
      <TextInput placeholder={'검색'} shadow={'md'}/>
      <Box
        c={'surface.text'}
        bg={'surface.default'}
        bc={'surface.highest'}
        bd={'md'}
        p={'md'}
        gap={'md'}
        r={'sm'}
        shadow={'md'}
        style={{ flex: 1 }}
      >
        Preview
        <Button>
          default
        </Button>
        <Button variant={'primary'}>
          primary
        </Button>
        <Button variant={'text'}>
          text
        </Button>
      </Box>
      <Box w={'100%'} direction={'row'} gap={'sm'} wrap={'wrap'} class={toolContainerStyle}>
        <Button variant={'text'} gap={'xs'} class={toolStyle}>
          <Icon name={'settings'} size={'1.8rem'}/>
          설정
        </Button>
        <Button variant={'text'} gap={'xs'} class={toolStyle}>
          <Icon name={'search'} size={'1.8rem'}/>
          고급 검색
        </Button>
        <Show when={config()?.developer || true}>
          <DevtoolButton/>
        </Show>
      </Box>
    </Box>
  );
};
