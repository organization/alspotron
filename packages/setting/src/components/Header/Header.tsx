import { Icon, Text, Button, Box } from '@alspotron/ui';

import {
  buttonStyle,
  closeButtonStyle,
  containerStyle,
  logoStyle,
  titleContainerStyle,
  titleStyle
} from './Header.css';

import logo from '../../assets/icon_music.png';
import { Show } from 'solid-js';
import { Platform } from '@alspotron/shared/renderer';

export const Header = () => {
  return (
    <div class={containerStyle}>
      <Box direction={'row'} align={'center'} gap={'xs'} class={titleContainerStyle}>
        <img src={logo} class={logoStyle} alt={'logo'}/>
        <Text variant={'body'} class={titleStyle}>
          Alspotron
        </Text>
      </Box>
      <Show when={Platform.OS() !== 'mac'}>
        <Button variant={'icon'} class={buttonStyle}>
          <Icon name={'minimize'} size={'1.2rem'} />
        </Button>
        <Button variant={'icon'} class={buttonStyle}>
          <Icon name={'crop_square'} size={'1.2rem'} />
        </Button>
        <Button variant={'icon'} class={`${buttonStyle} ${closeButtonStyle}`}>
          <Icon name={'close'} size={'1.2rem'} />
        </Button>
      </Show>
    </div>
  );
};