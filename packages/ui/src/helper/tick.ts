export const nextTick = () => new Promise<void>((resolve) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
});
