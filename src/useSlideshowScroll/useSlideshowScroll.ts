import { RefObject, useEffect, useMemo, useRef } from "react";

interface UseSlideshowScrollOptions {
  alignment?: "left" | "right" | "center";
  passedContainerRef?: RefObject<HTMLDivElement>;
}

const getSpacing = (
  remainingSpace: number,
  alignment?: UseSlideshowScrollOptions["alignment"]
) => {
  if (alignment === "left") return 0;
  if (alignment === "right") return remainingSpace;
  return remainingSpace / 2;
};

export const useSlideshowScroll = (
  activeIndex: number,
  getId: (index: number) => string,
  options?: UseSlideshowScrollOptions
) => {
  const newContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useMemo(
    () => options?.passedContainerRef ?? newContainerRef,
    [options?.passedContainerRef]
  );
  useEffect(() => {
    if (containerRef.current) {
      const targetElement = document.getElementById(getId(activeIndex));
      const parentWidth = containerRef.current.clientWidth;
      const elementWidth = targetElement?.offsetWidth ?? 0;
      const elementOffsetLeft = targetElement?.offsetLeft ?? 0;
      const remainingSpace = parentWidth - elementWidth;
      const spaceLeftAndRight = getSpacing(remainingSpace, options?.alignment);
      containerRef.current.scrollTo({
        behavior: "smooth",
        left: elementOffsetLeft - spaceLeftAndRight,
      });
    }
  }, [activeIndex, options?.alignment]);

  return useMemo(
    () => ({
      containerRef,
    }),
    [containerRef]
  );
};
