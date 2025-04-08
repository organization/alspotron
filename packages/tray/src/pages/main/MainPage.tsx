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
      <TextInput placeholder={'검색'}/>
      <Box bg={'gray.50'} r={'sm'} bc={'gray.200'} bd={'md'} p={'md'} style={{ flex: 1 }}>
        Preview
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
        <Show when={config()?.developer}>
          <DevtoolButton/>
        </Show>
      </Box>
    </Box>
  );
};
