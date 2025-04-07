import { createMemo, createRenderEffect, on, onCleanup, onMount } from 'solid-js';
import { compile, serialize, stringify, prefixer, middleware, type Middleware } from 'stylis';

import useStyle from '../hooks/useStyle';
import { userCSSSelectors, userCSSTransitions } from '../utils/userCSSSelectors';

import type { StyleConfig } from '../../common/schema';

const userCSSMiddleware: Middleware = (element) => {
  if (element.type !== 'rule') {
    return;
  }

  const props = Array.isArray(element.props) ? element.props : [element.props];
  const mappedProps = props.map((prop) =>
    prop.replace(/alspotron-([a-z-]+)/g, (match, selectorName: string) => {
      if (Object.hasOwn(userCSSSelectors, selectorName)) {
        return `.${userCSSSelectors[selectorName as keyof typeof userCSSSelectors]}`;
      }

      const transitionName = Object.keys(userCSSTransitions).find((transitionName) =>
        selectorName.startsWith(transitionName),
      ) as keyof typeof userCSSTransitions;

      if (transitionName) {
        return `.${selectorName.replace(transitionName, userCSSTransitions[transitionName])}`;
      }

      return match;
    }),
  );

  element.props = mappedProps;
};

export interface UserCSSProps {
  theme?: StyleConfig;
}

const UserCSS = (props: UserCSSProps) => {
  const style = useStyle();
  const userCSS = () => {
    if (props.theme) return props.theme.userCSS ?? '';
    return style().userCSS ?? '';
  };
  const compiledCSS = createMemo(
    on(userCSS, (css) => {
      if (!css) return '';

      return serialize(compile(css), middleware([userCSSMiddleware, prefixer, stringify]));
    }),
  );

  const stylesheet = new CSSStyleSheet();
  createRenderEffect(() => {
    const compiled = compiledCSS();

    requestIdleCallback(() => {
      stylesheet.replace(compiled);
    });
  });
  onMount(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat([stylesheet]);
  });
  onCleanup(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (adoptedStyleSheet) => adoptedStyleSheet !== stylesheet,
    );
  });

  return <></>;
};

export default UserCSS;
