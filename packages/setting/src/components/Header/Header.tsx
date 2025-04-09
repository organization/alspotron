import { Text } from '@alspotron/ui';

import { containerStyle, logoStyle, titleStyle } from './Header.css';

import logo from '../../assets/icon_music.png';

export const Header = () => {
  return (
    <div class={containerStyle}>
      <img src={logo} class={logoStyle} alt={'logo'}/>
      <Text variant={'body'} class={titleStyle}>
        Alspotron
      </Text>
    </div>
  );
};