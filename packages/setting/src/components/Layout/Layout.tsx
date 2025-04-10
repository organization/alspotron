import { A, RouteProps, useLocation } from '@solidjs/router';
import { Box, Item, TextInput } from '@alspotron/ui';

import { Header } from '../Header';

import { containerStyle, contentStyle, logoStyle } from './Layout.css';
import logo from '../../assets/icon_music.png';

export type LayoutProps<T extends string> = RouteProps<T>;
export const Layout = <T extends string>(props: LayoutProps<T>) => {
  const location = useLocation();
  const match = <const T,>(link: string, value: T): T | undefined => (
    location.pathname.startsWith(link) ? value : undefined
  );

  return (
    <Box w={'100%'} h={'100%'}>
      <Header />
      <main class={containerStyle}>
        <Box w={'30rem'}>
          <Item.Group>
            <TextInput
              left={'search'}
              placeholder={'검색'}
            />
          </Item.Group>
          <Item.Group>
            <Item
              as={A}
              clickable
              name={'Alspotron'}
              left={<img src={logo} class={logoStyle} alt={'logo'}/>}
              shadow={match('/info', 'lg')}
              bg={match('/info', 'surface.default')}
              href={'/info'}
            />
            <Item
              as={A}
              clickable
              name={'일반'}
              leftIcon={'settings'}
              href={'/general'}
              shadow={match('/general', 'lg')}
              bg={match('/general', 'surface.default')}
            />
            <Item
              as={A}
              clickable
              name={'Devtool'}
              leftIcon={'bug_report'}
              href={'/dev'}
              shadow={match('/dev', 'lg')}
              bg={match('/dev', 'surface.default')}
            />
          </Item.Group>
        </Box>
        <Box
          w={'100%'}
          r={'sm'}
          bg={'surface.default'}
          shadow={'sm'}
          class={contentStyle}
        >
          {props.children}
        </Box>
      </main>
    </Box>
  );
};
