import { createMemo, createRenderEffect, onCleanup, onMount } from 'solid-js';
import { compile, serialize, stringify, middleware, Middleware } from 'stylis';
import useConfig from '../hooks/useConfig';
import { userCSSSelectors, userCSSTransitions } from '../utils/userCSSSelectors';

const userCSSMiddleware: Middleware = (element) => {
  if (element.type !== 'rule') {
    return;
  }

  const props = Array.isArray(element.props) ? element.props : [element.props];
  const mappedProps = props.map((prop) => prop.replace(/alspotron-([a-z-]+)/, (match, selectorName: string) => {
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
  const [config] = useConfig();
  const userCSS = () => config()?.style.userCSS ?? '';
  const compiledCSS = createMemo(
    () => serialize(
      compile(userCSS()),
      middleware([userCSSMiddleware, stringify])
    )
  );

  const stylesheet = new CSSStyleSheet();
  createRenderEffect(() => void stylesheet.replace(compiledCSS()));
  onMount(() => document.adoptedStyleSheets.push(stylesheet));
  onCleanup(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (adoptedStyleSheet) => adoptedStyleSheet !== stylesheet
    );
  });

  return <></>;
};

export default UserCSS;
