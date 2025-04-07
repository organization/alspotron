export const cl = (obj?: Record<string, boolean | undefined>): string => {
  if (!obj) return '';

  const result: string[] = [];

  Object.entries(obj).forEach(([className, value]) => {
    if (value) result.push(className);
  });

  return result.join(' ');
};

export const cx = (...classNames: unknown[]): string => classNames.filter((it) => !!it).join(' ');
