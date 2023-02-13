import { MutableRefObject, RefObject, useEffect } from "react";
import debounce from "../utils/debounce";
import { performScroll, ScrollAlignment } from "../utils/performScroll";
import { DATA_IDX_ATTR } from "./Constants";
import { SlideshowOptions } from "./SlideshowOptions";
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

const getSlidesSelectionObserver =
  (slideshowState: SlideshowState): IntersectionObserverCallback =>
  (entries) => {
    entries.forEach((entry) => {
      if (
        entry.intersectionRatio >= 0.5 &&
        entry.target instanceof HTMLImageElement
      ) {
        if (!entry.target.src) loadImage(entry.target as HTMLImageElement);
        const index = entry.target.getAttribute(DATA_IDX_ATTR);
        console.log(index);
        if (index) slideshowState.activeSlideIdx = parseInt(index);
      }
    });
  };

export const useScrollSetup = (
  length: number,
  setActiveSlideIdx: (idx: number) => void,
  slideshowState: SlideshowState,
  slidesRef: MutableRefObject<HTMLImageElement[]>,
  slidesContainerRef: RefObject<HTMLDivElement>,
  thumbnailsRef: MutableRefObject<HTMLImageElement[]>,
  thumbnailsContainerRef: RefObject<HTMLDivElement>,
  scrollAlignment: ScrollAlignment,
  enabled?: boolean
) => {
  useEffect(() => {
    thumbnailsRef.current = thumbnailsRef.current.slice(0, length);
    // Load thumbnails on intersection
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
      // Load slides on intersection and set slides index
      const observer = new IntersectionObserver(
        getSlidesSelectionObserver(slideshowState),
        {
          root: slidesContainerRef.current,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      slidesRef.current.forEach((slide) => observer.observe(slide));
    }
  }, [enabled, length, slidesRef.current, slidesContainerRef.current]);

  useEffect(() => {
    if (enabled && slidesContainerRef.current) {
      const setScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingSlides = true;
      };

      const unsetScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingSlides = false;
        setActiveSlideIdx(slideshowState.activeSlideIdx);
        if (thumbnailsRef.current[slideshowState.activeSlideIdx]) {
          const targetThumbnail =
            thumbnailsRef.current[slideshowState.activeSlideIdx].parentElement;
          targetThumbnail &&
            thumbnailsContainerRef.current &&
            performScroll(
              thumbnailsContainerRef.current,
              targetThumbnail,
              scrollAlignment
            );
        }
      };

      slidesContainerRef.current.onmousedown = () => {
        console.log("mouse down");
        setScrollingTarget();
      };
      slidesContainerRef.current.ontouchstart = () => {
        console.log("touch start");
        setScrollingTarget();
      };

      slidesContainerRef.current.onmouseup = debounce(() => {
        console.log("mouseup");
        unsetScrollingTarget();
      }, 100);
      slidesContainerRef.current.ontouchend = debounce(() => {
        console.log("calling touchend");
        unsetScrollingTarget();
      }, 500);
    }
  }, [slidesContainerRef, setActiveSlideIdx, scrollAlignment]);

  useEffect(() => {
    if (enabled && thumbnailsContainerRef.current) {
      const setScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingThumbnails = true;
      };

      const unsetScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingThumbnails = false;
      };

      thumbnailsContainerRef.current.onmousedown = () => {
        console.log("mouse down thumbnails");
        setScrollingTarget();
      };
      thumbnailsContainerRef.current.ontouchstart = () => {
        console.log("touch start thumbnails");
        setScrollingTarget();
      };

      thumbnailsContainerRef.current.onmouseup = () => {
        console.log("mouseup thumbnails");
        unsetScrollingTarget();
      };
      thumbnailsContainerRef.current.ontouchend = debounce(() => {
        console.log("calling touchend thumbnails");
        unsetScrollingTarget();
      }, 1200);
    }
  }, [thumbnailsContainerRef]);
};
