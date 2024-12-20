import { Accessor, createEffect, on, onCleanup, onMount } from 'solid-js';

export const useClassStyle = (className: string, style: Accessor<string>) => {
  const stylesheet = new CSSStyleSheet();

  onMount(() => {
    const isExist = Array.from(document.adoptedStyleSheets).some(
      (adoptedStyleSheet) => adoptedStyleSheet === stylesheet,
    );
    if (isExist) return;

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
  });

  createEffect(
    on(style, () => {
      stylesheet.replaceSync(`*:is(.${className}) {\n${style()}\n}`);
    }),
  );

  onCleanup(() => {
    document.adoptedStyleSheets = Array.from(
      document.adoptedStyleSheets,
    ).filter((adoptedStyleSheet) => adoptedStyleSheet !== stylesheet);
  });

  return stylesheet;
};
