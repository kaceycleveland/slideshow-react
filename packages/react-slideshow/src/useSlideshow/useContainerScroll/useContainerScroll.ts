import { MutableRefObject, RefObject, useEffect, useMemo, useRef } from "react";
import { SlideshowState } from "../useSlideshow";

interface UseContainerScrollOptions {
  alignment?: "left" | "right" | "center" | "top" | "bottom";
  passedContainerRef?: RefObject<HTMLDivElement>;
  dependentContainerRef?: RefObject<HTMLDivElement>;
  isVertical?: boolean;
}

const getSpacing = (
  remainingSpace: number,
  alignment?: UseContainerScrollOptions["alignment"]
) => {
  if (alignment === "left" || alignment === "top") return 0;
  if (alignment === "right" || alignment === "bottom") return remainingSpace;
  return remainingSpace / 2;
};

const performHorizontalScroll = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: UseContainerScrollOptions["alignment"]
) => {
  const parentWidth = containerElement.clientWidth;
  const elementWidth = slideElement.offsetWidth;
  const elementOffsetLeft = slideElement.offsetLeft;
  const remainingSpace = parentWidth - elementWidth;
  const spaceLeft = getSpacing(remainingSpace, alignment);

  containerElement.scrollTo({
    behavior: "smooth",
    left: elementOffsetLeft - spaceLeft,
  });
};

const performVerticalScroll = (
  containerElement: HTMLDivElement,
  slideElement: HTMLElement,
  alignment: UseContainerScrollOptions["alignment"]
) => {
  const parentHeight = containerElement.clientHeight;
  const elementHeight = slideElement.offsetHeight;
  const elementOffsetTop = slideElement.offsetTop;
  const remainingSpace = parentHeight - elementHeight;
  const spaceLeft = getSpacing(remainingSpace, alignment);

  console.log("performing vertical scroll");

  containerElement.scrollTo({
    behavior: "smooth",
    top: elementOffsetTop - spaceLeft,
  });
};

export const useContainerScroll = (
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
    console.log("before scroll", slideshowState, containerRef.current, refs);
    if (
      containerRef.current &&
      (!slideshowState.manualScrolling ||
        containerRef.current !== slideshowState.scrollingElement)
    ) {
      console.log(
        "performing scroll",
        slideshowState.scrollingElement,
        options.dependentContainerRef?.current
      );
      const targetElement = refs.current[activeIndex].parentElement;
      if (targetElement) {
        options?.isVertical
          ? performVerticalScroll(
              containerRef.current,
              targetElement,
              options.alignment
            )
          : performHorizontalScroll(
              containerRef.current,
              targetElement,
              options.alignment
            );
      }
    }
  }, [
    activeIndex,
    options?.alignment,
    options?.isVertical,
    options?.dependentContainerRef,
    slideshowState,
    refs,
  ]);

  return useMemo(
    () => ({
      containerRef,
    }),
    [containerRef]
  );
};
