export type ScrollAlignment = "left" | "right" | "center" | "top" | "bottom";

const getSpacing = (remainingSpace: number, alignment?: ScrollAlignment) => {
  if (alignment === "left" || alignment === "top") return 0;
  if (alignment === "right" || alignment === "bottom") return remainingSpace;
  return remainingSpace / 2;
};

const getHorizontalSpacing = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: ScrollAlignment
) => {
  const parentWidth = containerElement.clientWidth;
  const elementWidth = slideElement.offsetWidth;
  const elementOffsetLeft = slideElement.offsetLeft;
  const remainingSpace = parentWidth - elementWidth;
  const spaceLeft = getSpacing(remainingSpace, alignment);

  return elementOffsetLeft - spaceLeft;
};

const getVerticalSpacing = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: ScrollAlignment
) => {
  const parentHeight = containerElement.clientHeight;
  const elementHeight = slideElement.offsetHeight;
  const elementOffsetTop = slideElement.offsetTop;
  const remainingSpace = parentHeight - elementHeight;
  const spaceLeft = getSpacing(remainingSpace, alignment);

  return elementOffsetTop - spaceLeft;
};

export const performScroll = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: ScrollAlignment
) => {
  const top = getVerticalSpacing(containerElement, slideElement, alignment);
  const left = getHorizontalSpacing(containerElement, slideElement, alignment);
  console.log("top spacing", top, left);
  containerElement.scrollTo({
    behavior: "smooth",
    top,
    left,
  });
};
