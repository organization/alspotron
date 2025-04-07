import { onCleanup } from 'solid-js';

export const createClickAway = (onClickAway: () => void) => {
  return (element: HTMLElement | null | undefined) => {
    if (!element) return;

    const onClick = (event: MouseEvent) => {
      const path = event.composedPath();
      if (path.includes(element)) return;

      onClickAway();
      cleanUp();
    };

    let isCleanUp = false;
    const cleanUp = () => {
      if (isCleanUp) return;

      document.removeEventListener('click', onClick);
      isCleanUp = true;
    };

    document.addEventListener('click', onClick);
    onCleanup(cleanUp);
  };
};
