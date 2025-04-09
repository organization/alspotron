import { RouteProps } from '@solidjs/router';
import { Box, Item } from '@alspotron/ui';

import { logoStyle } from './Layout.css';
import logo from '../../assets/icon_music.png';

export type LayoutProps<T extends string> = RouteProps<T>;
export const Layout = <T extends string>(props: LayoutProps<T>) => {
  return (
    <Box w={'100%'} h={'100%'}>
      <Box
        w={'100%'}
        h={'100%'}
        p={'xs'}
        direction={'row'}
        gap={'xs'}
      >
        <Box w={'30rem'} style={{ 'margin-top': '34px' }}>
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
          h={'100%'}
          p={'md'}
          r={'sm'}
          bg={'surface.default'}
          shadow={'sm'}
        >
          {props.children}
        </Box>
      </Box>
    </Box>
  );
};
