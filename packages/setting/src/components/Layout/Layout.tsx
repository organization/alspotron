import { A, RouteProps, useLocation } from '@solidjs/router';
import { Box, Item, TextInput } from '@alspotron/ui';

import { Header } from '../Header';

import { containerStyle, contentStyle, logoStyle, sidebarStyle, sideBottomStyle, sideTopStyle } from './Layout.css';
import logo from '../../assets/icon_music.png';
import rootPackage from '../../../../../package.json';

export type LayoutProps<T extends string> = RouteProps<T>;
export const Layout = <T extends string>(props: LayoutProps<T>) => {
  const location = useLocation();
  const match = <const T, >(link: string, value: T): T | undefined => (
    location.pathname.startsWith(link) ? value : undefined
  );

  return (
    <Box w={'100%'} h={'100%'}>
      <Header/>
      <main class={containerStyle}>
        <nav class={sidebarStyle}>
          <Box class={sideTopStyle}>
            <TextInput
              left={'search'}
              placeholder={'검색'}
            />
          </Box>
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
            name={'뷰어 및 테마'}
            leftIcon={'palette'}
            href={'/view'}
            shadow={match('/view', 'lg')}
            bg={match('/view', 'surface.default')}
          />
          <Item
            as={A}
            clickable
            name={'개발 및 실험'}
            leftIcon={'bug_report'}
            href={'/dev'}
            shadow={match('/dev', 'lg')}
            bg={match('/dev', 'surface.default')}
          />
          <Box class={sideBottomStyle}>
            <Item
              as={A}
              clickable
              name={'Alspotron'}
              description={rootPackage.version}
              left={<img src={logo} class={logoStyle} alt={'logo'}/>}
              shadow={match('/info', 'lg')}
              bg={match('/info', 'surface.default')}
              href={'/info'}
            />
          </Box>
        </nav>
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
