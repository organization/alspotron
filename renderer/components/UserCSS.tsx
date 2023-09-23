import { createMemo, createRenderEffect, onCleanup, onMount } from 'solid-js';
import { compile, serialize, stringify, prefixer, middleware, Middleware } from 'stylis';

import useStyle from '../hooks/useStyle';
import { userCSSSelectors, userCSSTransitions } from '../utils/userCSSSelectors';

const userCSSMiddleware: Middleware = (element) => {
  if (element.type !== 'rule') {
    return;
  }

  const props = Array.isArray(element.props) ? element.props : [element.props];
  const mappedProps = props.map((prop) => prop.replace(/alspotron-([a-z-]+)/g, (match, selectorName: string) => {
    if (Object.hasOwn(userCSSSelectors, selectorName)) {
      return `.${userCSSSelectors[selectorName as keyof typeof userCSSSelectors]}`;
    }

    const transitionName = Object.keys(userCSSTransitions)
      .find((transitionName) => selectorName.startsWith(transitionName)) as keyof typeof userCSSTransitions;

    if (transitionName) {
      return `.${selectorName.replace(transitionName, userCSSTransitions[transitionName])}`;
    }

    return match;
  }));

  element.props = mappedProps;
};

const UserCSS = () => {
  const style = useStyle();
  const userCSS = () => style().userCSS ?? '';
  const compiledCSS = createMemo(() => {
    if (!userCSS()) return '';
    
    return serialize(
      compile(userCSS()),
      middleware([userCSSMiddleware, prefixer, stringify])
    );
  });

  const stylesheet = new CSSStyleSheet();
  createRenderEffect(() => stylesheet.replaceSync(compiledCSS())); // DO NOT USE replace() HERE (maybe a chromium bug)
  onMount(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat([stylesheet]);
  });
  onCleanup(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (adoptedStyleSheet) => adoptedStyleSheet !== stylesheet
    );
  });

  return <></>;
};

export default UserCSS;
