import { splitProps, ValidComponent } from 'solid-js';

import { cx, sx } from '../../helper';

import { Polymorphic, PolymorphicProps } from '../Polymorphic';

import { boxSizeStyle, boxStyle, BoxStyleType } from './Box.css';

export type BoxOnlyProps = BoxStyleType;
export type BoxSizeProps = {
  w?: string;
  h?: string;
  size?: string;
}
export type BoxProps<T extends ValidComponent> = BoxOnlyProps & BoxSizeProps & PolymorphicProps<T>
export const Box = <T extends ValidComponent = 'div'>(props: BoxProps<T>) => {
  const [boxStyleProps, boxSizeProps, rest] = splitProps(
    props,
    ['direction', 'justify', 'align', 'wrap', 'gap', 'p', 'px', 'py', 'm', 'mx', 'my', 'r', 'c', 'bg', 'bc', 'shadow', 'bd'],
    ['w', 'h', 'size']
  );

  const boxClass = () => cx(
    boxStyle({
      direction: boxStyleProps.direction,
      justify: boxStyleProps.justify,
      align: boxStyleProps.align,
      wrap: boxStyleProps.wrap,
      gap: boxStyleProps.gap,
      p: boxStyleProps.p,
      px: boxStyleProps.px,
      py: boxStyleProps.py,
      m: boxStyleProps.m,
      mx: boxStyleProps.mx,
      my: boxStyleProps.my,
      r: boxStyleProps.r,
      c: boxStyleProps.c,
      bg: boxStyleProps.bg,
      bc: boxStyleProps.bc,
      shadow: boxStyleProps.shadow,
      bd: boxStyleProps.bd,
    }),
    boxSizeStyle,
  );

  return (
    <Polymorphic
      {...rest}
      as={rest.as ?? 'div'}
      classList={{
        [boxClass()]: true,
        [rest.class]: true,
        ...rest.classList,
      }}
      style={sx(
        {
          width: boxSizeProps.w,
          height: boxSizeProps.h,
          'font-size': boxSizeProps.size,
        },
        rest.style,
      )}
    />
  );
};
