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

const getSlidesSelectionObserver: (
  setActiveSlideIdx: (idx: number) => void,
  slideshowState: SlideshowState
) => IntersectionObserverCallback =
  (setActiveSlideIdx, slideshowState) => (entries, observer) => {
    entries.forEach((entry) => {
      if (
        entry.intersectionRatio >= 0.5 &&
        entry.target instanceof HTMLImageElement
      ) {
        console.log(entry.target);
        if (!entry.target.src) {
          console.log("LOADING IMAGE");
          loadImage(entry.target as HTMLImageElement);
        }
        if (
          !slideshowState.manualScrollingSlides &&
          !slideshowState.transitioning
        ) {
          const index = entry.target.getAttribute(DATA_IDX_ATTR);
          console.log("INTERSECTION BOSERVER", index);
          index && setActiveSlideIdx(parseInt(index));
        }
      }
    });
  };

const getThumbnailSelectionObserver: (
  setActiveThumbnailIdx: (idx: number) => void,
  slideshowState: SlideshowState
) => IntersectionObserverCallback =
  (setActiveThumbnailIdx, slideshowState) => (entries, observer) => {
    entries.forEach((entry) => {
      const index = entry.target.getAttribute(DATA_IDX_ATTR);
      // console.log("INTERSECTION OBSERVER", index, slideshowState);
      if (
        index &&
        entry.intersectionRatio >= 0.5 &&
        slideshowState.manualScrollingSlides
      ) {
        setActiveThumbnailIdx(parseInt(index));
      }
    });
  };

export const useScrollSetup = (
  length: number,
  setActiveSlideIdx: (idx: number) => void,
  setActiveThumbnailIdx: (idx: number) => void,
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
      const observer = new IntersectionObserver(
        getSlidesSelectionObserver(setActiveSlideIdx, slideshowState),
        {
          root: slidesContainerRef.current,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      const selectionObserver = new IntersectionObserver(
        getThumbnailSelectionObserver(setActiveThumbnailIdx, slideshowState),
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
    setActiveThumbnailIdx,
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
        slideshowState.manualScrollingSlides = true;
      };

      const unsetScrollingTarget = (e: MouseEvent | TouchEvent) => {
        console.log("mouseup");
        slideshowState.scrollingElement = null;
        slideshowState.manualScrollingSlides = false;
      };

      slidesContainerRef.current.onmousedown = setScrollingTarget;
      // slidesContainerRef.current.ontouchstart = setScrollingTarget;

      slidesContainerRef.current.onmouseup = unsetScrollingTarget;
      // slidesContainerRef.current.ontouchend = unsetScrollingTarget;
    }
  }, [slidesContainerRef]);
};
