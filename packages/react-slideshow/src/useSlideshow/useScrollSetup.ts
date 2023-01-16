import { MutableRefObject, RefObject, useEffect } from "react";
import { getScrollParent } from "../utils/getScrollParent";
import { DATA_IDX_ATTR } from "./Constants";
import { SlideshowState } from "./useSlideshow";
import { loadImage } from "./utils/loadImage";

const onIntersection: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio >= 0.5) {
      observer.unobserve(entry.target);
      loadImage(entry.target as HTMLImageElement);
    }
  });
};

const getSelectionObserver: (
  setSlideIdx: (idx: number) => void,
  slideshowState: SlideshowState
) => IntersectionObserverCallback =
  (setSlideIdx, slideshowState) => (entries, observer) => {
    entries.forEach((entry) => {
      const index = entry.target.getAttribute(DATA_IDX_ATTR);
      console.log("INTERSECTION OBSERVER", index, slideshowState);
      if (
        index &&
        entry.intersectionRatio >= 0.5 &&
        slideshowState.manualScrolling
      ) {
        setSlideIdx(parseInt(index));
      }
    });
  };

export const useScrollSetup = (
  length: number,
  setSlideIdx: (idx: number) => void,
  slideshowState: SlideshowState,
  slidesRef: MutableRefObject<HTMLImageElement[]>,
  slidesContainerRef: RefObject<HTMLDivElement>,
  thumbnailsRef: MutableRefObject<HTMLImageElement[]>,
  thumbnailsContainerRef: RefObject<HTMLDivElement>,
  enabled?: boolean
) => {
  useEffect(() => {
    thumbnailsRef.current = thumbnailsRef.current.slice(0, length);
    const observer = new IntersectionObserver(onIntersection, {
      root: thumbnailsContainerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    });
    thumbnailsRef.current.forEach((thumbnail) => observer.observe(thumbnail));
  }, [length, thumbnailsRef.current, thumbnailsContainerRef.current]);

  useEffect(() => {
    if (enabled) {
      slidesRef.current = slidesRef.current.slice(0, length);
      const observer = new IntersectionObserver(onIntersection, {
        root: slidesContainerRef.current,
        rootMargin: "0px",
        threshold: 0.5,
      });
      const selectionObserver = new IntersectionObserver(
        getSelectionObserver(setSlideIdx, slideshowState),
        {
          root: slidesContainerRef.current,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      slidesRef.current.forEach((slide) => {
        selectionObserver.observe(slide);
        observer.observe(slide);
      });
    }
  }, [
    enabled,
    length,
    setSlideIdx,
    slidesRef.current,
    slidesContainerRef.current,
  ]);

  useEffect(() => {
    if (enabled && slidesContainerRef.current) {
      let isScrolling: any;
      slidesContainerRef.current.onscroll = () => {
        // Clear our timeout throughout the scroll
        slideshowState.transitioning = true;
        window.clearTimeout(isScrolling);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(() => {
          // Run the callback
          slideshowState.transitioning = false;
          console.log("Scrolling has stopped.");
        }, 30);
      };

      const setScrollingTarget = (e: MouseEvent | TouchEvent) => {
        slideshowState.scrollingElement = slidesContainerRef.current;
        console.log("mousedown", slideshowState.scrollingElement);
        slideshowState.manualScrolling = true;
      };

      const unsetScrollingTarget = (e: MouseEvent | TouchEvent) => {
        console.log("mouseup");
        slideshowState.scrollingElement = null;
        slideshowState.manualScrolling = false;
      };

      slidesContainerRef.current.onmousedown = setScrollingTarget;
      // slidesContainerRef.current.ontouchstart = setScrollingTarget;

      slidesContainerRef.current.onmouseup = unsetScrollingTarget;
      // slidesContainerRef.current.ontouchend = unsetScrollingTarget;
    }
  }, [slidesContainerRef]);
};
