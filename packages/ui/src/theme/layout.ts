import { StyleRule } from '@vanilla-extract/css';
import { createMediaQuery } from '@solid-primitives/media';

const size = {
  tablet: '768px',
  desktop: '1024px',
};
export const LayoutCondition = {
  tablet: `screen and (min-width: ${size.tablet})`,
  desktop: `screen and (min-width: ${size.desktop})`
};

type WithQueryStyle<M, T = never, D = never> = Omit<M, 'tablet' | 'desktop'> & (
    T | D extends never
  ? {}
  : {
    '@media': {
      [condition in keyof typeof LayoutCondition]: condition extends 'tablet' ? T : D
    }
  }
  );

export const responsive = <
  M extends StyleRule = {},
  T extends StyleRule = {},
  D extends StyleRule = {},
>({
  tablet,
  desktop,
  ...mobile
}: M & { tablet?: T; desktop?: D }): WithQueryStyle<M, T, D> => {
  if (!tablet && !desktop) return mobile as WithQueryStyle<M, T, D>;

  if (!tablet && desktop) {
    return {
      ...mobile,
      '@media': {
        [LayoutCondition.desktop]: desktop,
      },
    } as unknown as WithQueryStyle<M, T, D>;
  }

  if (tablet && !desktop) {
    return {
      ...mobile,
      '@media': {
        [LayoutCondition.tablet]: tablet,
      },
    } as unknown as WithQueryStyle<M, T, D>;
  }

  return {
    ...mobile,

    '@media': {
      [LayoutCondition.tablet]: tablet,
      [LayoutCondition.desktop]: desktop,
    },
  } as unknown as WithQueryStyle<M, T, D>;
};

export const createResponsive = () => {
  const isDesktop = createMediaQuery(LayoutCondition.desktop);
  const isTablet = createMediaQuery(LayoutCondition.tablet);

  return new Proxy({
    desktop: false,
    tablet: false,
    mobile: true,
  }, {
    get(_, key) {
      if (key === 'desktop') return isDesktop();
      if (key === 'tablet') return isTablet();
      if (key === 'mobile') return !isDesktop() && !isTablet();

      return false;
    }
  });
};
