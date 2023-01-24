import { MutableRefObject, RefObject, useEffect, useMemo, useRef } from "react";
import { SlideshowState } from "../useSlideshow";

interface UseContainerScrollOptions {
  alignment?: "left" | "right" | "center" | "top" | "bottom";
  passedContainerRef?: RefObject<HTMLDivElement>;
}

const getSpacing = (
  remainingSpace: number,
  alignment?: UseContainerScrollOptions["alignment"]
) => {
  if (alignment === "left" || alignment === "top") return 0;
  if (alignment === "right" || alignment === "bottom") return remainingSpace;
  return remainingSpace / 2;
};

const getHorizontalSpacing = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: UseContainerScrollOptions["alignment"]
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
  alignment: UseContainerScrollOptions["alignment"]
) => {
  const parentHeight = containerElement.clientHeight;
  const elementHeight = slideElement.offsetHeight;
  const elementOffsetTop = slideElement.offsetTop;
  const remainingSpace = parentHeight - elementHeight;
  const spaceLeft = getSpacing(remainingSpace, alignment);

  return elementOffsetTop - spaceLeft;
};

const performScroll = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: UseContainerScrollOptions["alignment"]
) => {
  containerElement.scrollTo({
    behavior: "smooth",
    top: getVerticalSpacing(containerElement, slideElement, alignment),
    left: getHorizontalSpacing(containerElement, slideElement, alignment),
  });
};

export const useSlidesContainerScroll = (
  activeIndex: number,
  slideshowState: SlideshowState,
  refs: MutableRefObject<HTMLImageElement[]>,
  options: UseContainerScrollOptions
) => {
  const newContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useMemo(
    () => options?.passedContainerRef ?? newContainerRef,
    [options?.passedContainerRef]
  );
  useEffect(() => {
    if (containerRef.current && !slideshowState.manualScrollingSlides) {
      console.log("performing slides scroll", activeIndex);
      const targetElement = refs.current[activeIndex].parentElement;
      targetElement &&
        performScroll(containerRef.current, targetElement, options.alignment);
    }
  }, [activeIndex, options?.alignment, slideshowState, refs]);

  return useMemo(
    () => ({
      containerRef,
    }),
    [containerRef]
  );
};
