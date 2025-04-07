import { keyframes, StyleRule, styleVariants } from '@vanilla-extract/css';

type PopoverAnimationKey = 'enter' | 'exit';
export type PopoverAnimation = Record<PopoverAnimationKey, string>;
export const popoverAnimation = <T extends Record<PopoverAnimationKey, StyleRule>>(
  animation: T
): PopoverAnimation => {
  const enterKeyframe = keyframes({
    '0%': animation.enter,
  });
  const exitKeyframe = keyframes({
    '100%': animation.exit,
  });

  return styleVariants({
    enter: {
      animation: `${enterKeyframe} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    exit: {
      animation: `${exitKeyframe} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
    },
  });
};