import { Button, Box, Icon, TextInput } from '@alspotron/ui';

// import { logoStyle } from './MainPage.css';

// import MainIcon from '../../../../../assets/icon_music.png';

export const MainPage = () => {
  return (
    <Box h={'100%'} p={'md'} gap={'sm'}>
      <Box direction={'row'} py={'sm'} gap={'xs'} size={'1.6rem'}>
        {/*<img src={MainIcon} class={logoStyle} alt={'logo'} />*/}
        Alspotron
        <div style={{ flex: 1 }} />
        <Icon name={'bug_report'} size={'1.8rem'} />
        <Icon name={'power_settings_new'} size={'1.8rem'} />
      </Box>
      <TextInput placeholder={'search'} />
      <Box bg={'gray.100'} r={'sm'} bc={'gray.300'} bd={'md'} p={'md'} style={{ flex: 1 }}>
        Preview
      </Box>
      <Box direction={'row'} gap={'sm'}>
        <Button variant={'text'} gap={'xs'} style={{ flex: 1 }}>
          <Icon name={'settings'} size={'1.8rem'} />
          설정
        </Button>
        <Button variant={'text'} gap={'xs'} style={{ flex: 1 }}>
          <Icon name={'search'} size={'1.8rem'} />
          고급 검색
        </Button>
      </Box>
    </Box>
  );
};
