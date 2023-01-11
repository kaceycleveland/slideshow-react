import { MutableRefObject, RefObject, useEffect, useMemo, useRef } from "react";
import { SlideshowState } from "../useSlideshow";

interface UseContainerScrollOptions {
  alignment?: "left" | "right" | "center";
  passedContainerRef?: RefObject<HTMLDivElement>;
}

const getSpacing = (
  remainingSpace: number,
  alignment?: UseContainerScrollOptions["alignment"]
) => {
  if (alignment === "left") return 0;
  if (alignment === "right") return remainingSpace;
  return remainingSpace / 2;
};

export const useContainerScroll = (
  activeIndex: number,
  slideshowState: SlideshowState,
  refs: MutableRefObject<HTMLImageElement[]>,
  options?: UseContainerScrollOptions
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
      console.log("performing scroll", slideshowState.scrollingElement);
      const targetElement = refs.current[activeIndex].parentElement;
      const parentWidth = containerRef.current.clientWidth;
      const elementWidth = targetElement?.offsetWidth ?? 0;
      const elementOffsetLeft = targetElement?.offsetLeft ?? 0;
      const remainingSpace = parentWidth - elementWidth;
      const spaceLeftAndRight = getSpacing(remainingSpace, options?.alignment);
      console.log(
        "TARGET ELEMENT",
        parentWidth,
        elementWidth,
        elementOffsetLeft,
        spaceLeftAndRight,
        targetElement,
        containerRef.current,
        elementOffsetLeft - spaceLeftAndRight
      );
      console.dir(targetElement);
      containerRef.current.scrollTo({
        behavior: "smooth",
        left: elementOffsetLeft - spaceLeftAndRight,
      });
    }
  }, [activeIndex, options?.alignment, slideshowState, refs]);

  return useMemo(
    () => ({
      containerRef,
    }),
    [containerRef]
  );
};
