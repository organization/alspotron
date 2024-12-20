interface HorizontalScrollOptions {
  offset?: number;
}

//https://stackoverflow.com/questions/70226035/smooth-horizontal-wheel-only-scrolling
const useHorizontalScroll = (
  container: HTMLElement,
  { offset = 16 }: HorizontalScrollOptions = {},
) => {
  let scrollWidth: number;
  let targetLeft: number;
  const getScrollStep = () => scrollWidth / offset;

  const scrollLeft = () => {
    const beforeLeft = container.scrollLeft;
    const wantDx = getScrollStep();
    const diff = targetLeft - container.scrollLeft;
    const dX = wantDx >= Math.abs(diff) ? diff : Math.sign(diff) * wantDx;

    container.scrollBy(dX, 0);

    if (dX === diff) return;
    if (
      beforeLeft === container.scrollLeft ||
      container.scrollLeft === targetLeft
    )
      return;

    requestAnimationFrame(scrollLeft);
  };

  container.addEventListener('wheel', (event) => {
    event.preventDefault();

    scrollWidth = container.scrollWidth - container.clientWidth;
    targetLeft = Math.min(
      scrollWidth,
      Math.max(0, container.scrollLeft + event.deltaY),
    );

    requestAnimationFrame(scrollLeft);
  });
};

export default useHorizontalScroll;
