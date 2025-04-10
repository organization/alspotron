import { RouteProps } from '@solidjs/router';
import { Box, Item } from '@alspotron/ui';

import { Header } from '../Header';

import { containerStyle, logoStyle } from './Layout.css';
import logo from '../../assets/icon_music.png';

export type LayoutProps<T extends string> = RouteProps<T>;
export const Layout = <T extends string>(props: LayoutProps<T>) => {
  return (
    <Box w={'100%'} h={'100%'} style={{

    }}>
      <Header />
      <main class={containerStyle}>
        <Box w={'30rem'}>
          <Item.Group>
            <Item
              name={'Alspotron'}
              left={<img src={logo} class={logoStyle} alt={'logo'}/>}
              shadow={'lg'}
              bg={'surface.highest'}
            />
            <Item
              name={'일반'}
              leftIcon={'settings'}
              clickable
            />
            <Item
              name={'뷰어'}
              leftIcon={'grid_view'}
              clickable
            />
          </Item.Group>
        </Box>
        <Box
          w={'100%'}
          r={'sm'}
          bg={'surface.default'}
          shadow={'sm'}
        >
          {props.children}
        </Box>
      </main>
    </Box>
  );
};
