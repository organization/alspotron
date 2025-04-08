import { JSX } from 'solid-js';
import { Box, Text } from '@alspotron/ui';

import { logoStyle, titleStyle } from './Header.css';

import logo from '../../assets/icon_music.png';

export type HeaderProps = {
  left?: JSX.Element;
  children?: JSX.Element;
}
export const Header = (props: HeaderProps) => {
  return (
    <Box w={'100%'} direction={'row'} gap={'xs'} size={'1.6rem'} align={'center'}>
      {props.left}
      <img src={logo} class={logoStyle} alt={'logo'} />
      <Text variant={'title'} class={titleStyle}>
        Alspotron
      </Text>
      {props.children}
    </Box>
  );
};
