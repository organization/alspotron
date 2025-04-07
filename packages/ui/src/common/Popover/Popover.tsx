import {
  batch,
  children,
  createEffect,
  createResource,
  createSignal, mergeProps,
  on,
  onCleanup,
  onMount,
  Show,
  splitProps
} from 'solid-js';
import {
  autoUpdate,
  AutoUpdateOptions,
  computePosition,
  flip,
  Middleware,
  offset,
  Placement,
  shift, size
} from '@floating-ui/dom';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Portal } from 'solid-js/web';

import { PopoverAnimation } from './animation';

import {
  animationStyle,
  defaultAnimation,
  maxHeight,
  maxWidth,
  placementX,
  placementY,
  popoverStyle,
  x,
  y
} from './Popover.css';
import type { JSX } from 'solid-js/jsx-runtime';

export type PopoverProps = {
  open?: boolean;
  element: JSX.Element;
  children: JSX.Element;

  placement?: Placement;
  flip?: boolean;
  shift?: boolean;
  size?: boolean | number;
  offset?: number | {
    main?: number;
    cross?: number;
  };
  autoUpdate?: boolean | AutoUpdateOptions;
  animation?: PopoverAnimation;
};
export const Popover = (props: PopoverProps) => {
  const target = children(() => props.children);
  const [popupProps, local] = splitProps(
    mergeProps(
      {
        flip: true,
        shift: true,
        size: true,
      },
      props
    ),
    ['placement', 'flip', 'shift', 'size', 'offset', 'autoUpdate', 'animation'],
  );

  const [enter, setEnter] = createSignal(false);
  const [exit, setExit] = createSignal(false);
  const [open, setOpen] = createSignal(local.open ?? false);
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const [max, setMax] = createSignal<[number, number] | null>(null);
  const [position, { refetch }] = createResource(async () => {
    const popupEl = element();
    const targetEl = target();

    if (!(targetEl instanceof HTMLElement)) return;
    if (!popupEl) return null;

    const position = await computePosition(targetEl, popupEl, options());
    const placement = getPlacementOffset(position.placement);

    popupEl.style.setProperty(placementX, `${placement[0]}`);
    popupEl.style.setProperty(placementY, `${placement[1]}`);

    return {
      position,
      placement,
    };
  });

  const options = () => {
    const middleware: Middleware[] = [];

    if (popupProps.flip) middleware.push(flip());
    if (popupProps.shift) middleware.push(shift());
    if (popupProps.size) {
      const padding = typeof popupProps.size === 'number' ? popupProps.size : 0;
      middleware.push(size({
        padding,
        apply({ availableWidth, availableHeight }) {
          const width = Math.max(0, availableWidth - padding);
          const height = Math.max(0, availableHeight - padding);

          setMax([width, height]);
        },
      }));
    }
    if (popupProps.offset) {
      if (typeof popupProps.offset === 'number') {
        middleware.push(offset(popupProps.offset));
      } else {
        middleware.push(offset({
          mainAxis: popupProps.offset.main,
          crossAxis: popupProps.offset.cross,
        }));
      }
    }

    return {
      placement: popupProps.placement,
      middleware,
    };
  };
  const getPlacementOffset = (placement: Placement): [number, number] => {
    let x = 0.5;
    let y = 0.5;

    if (placement.startsWith('top')) y = 1;
    if (placement.startsWith('bottom')) y = 0;
    if (placement.startsWith('left')) x = 0;
    if (placement.startsWith('right')) x = 1;

    if (placement.endsWith('-start')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) x = 0;
      else y = 1;
    }
    if (placement.endsWith('-end')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) x = 1;
      else y = 0;
    }

    return [x, y];
  };

  const cleanUp = () => {
    const popup = element();

    setExit(false);
    setOpen(false);

    popup?.removeEventListener('animationend', cleanUp);
    popup?.removeEventListener('animationcancel', cleanUp);
  };

  onMount(refetch);
  createEffect(on(element, refetch));
  createEffect(() => {
    const useAutoUpdate = popupProps.autoUpdate ?? true;
    if (useAutoUpdate) {
      const popupEl = element();
      const targetEl = target();

      if (!(targetEl instanceof HTMLElement)) return;
      if (!popupEl) return null;

      const options = typeof useAutoUpdate === 'boolean' ? undefined : useAutoUpdate;
      const cleanUp = autoUpdate(
        targetEl,
        popupEl,
        () => requestAnimationFrame(refetch),
        options,
      );

      onCleanup(cleanUp);
    }
  });

  createEffect(on(() => local.open, async () => {
    if (local.open) {
      cleanUp();

      batch(() => {
        setOpen(true);
        setExit(false);
        setEnter(true);
      });
    } else {
      const popup = element();
      if (!popup) return;

      batch(() => {
        setEnter(false);
        setExit(true);
      });

      requestAnimationFrame(() => {
        popup.addEventListener('animationend', cleanUp, { once: true });
        popup.addEventListener('animationcancel', cleanUp, { once: true });
      });
    }
  }));

  return (
    <>
      {target}
      <Show when={open()}>
        <Portal>
          <div
            ref={setElement}
            classList={{
              [popoverStyle]: true,
            }}
            style={assignInlineVars({
              [x]: `${position()?.position.x ?? 0}px`,
              [y]: `${position()?.position.y ?? 0}px`,
              [placementX]: `${position()?.placement[0] ?? 0.5}`,
              [placementY]: `${position()?.placement[1] ?? 0.5}`,
              [maxWidth]: max() ? `${max()![0]}px` : undefined,
              [maxHeight]: max() ? `${max()![1]}px` : undefined,
            })}
          >
            <div
              classList={{
                [animationStyle]: true,
                [(popupProps.animation ?? defaultAnimation).enter]: enter(),
                [(popupProps.animation ?? defaultAnimation).exit]: exit(),
              }}
            >
              {local.element}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
};
