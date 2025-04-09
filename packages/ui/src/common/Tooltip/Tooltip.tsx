import { children, createEffect, createSignal, onCleanup, onMount } from 'solid-js';

import { Popover } from '../Popover';

import { containerStyle } from './Tooltip.css';
import type { JSX } from 'solid-js/jsx-runtime';

export type TooltipProps = {
  enabled?: boolean;
  label?: JSX.Element;
  children: JSX.Element;
};
export const Tooltip = (props: TooltipProps) => {
  const enabled = () => props.enabled ?? true;
  if (!enabled()) return props.children;

  const child = children(() => props.children);

  const [open, setOpen] = createSignal(false);

  onMount(() => {
    const target = child();
    if (!(target instanceof HTMLElement)) return;

    const enter = () => {
      if (enabled()) setOpen(true);
    }
    const leave = () => setOpen(false);
    target.addEventListener('mouseenter', enter);
    target.addEventListener('mouseleave', leave);

    onCleanup(() => {
      target.removeEventListener('mouseenter', enter);
      target.removeEventListener('mouseleave', leave);
    });
  });

  createEffect(() => {
    if (!enabled()) setOpen(false);
  });

  return (
    <Popover
      open={open()}
      element={
        <div class={containerStyle}>
          {props.label}
        </div>
      }
    >
      {child()}
    </Popover>
  );
};
