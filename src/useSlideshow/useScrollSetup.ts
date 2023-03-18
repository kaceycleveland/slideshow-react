import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import waitForScrollEnd from "../utils/waitForScrollEnd";
import { DATA_IDX_ATTR } from "./Constants";
import { SlideshowOptions } from "./SlideshowOptions";
import { SlideshowState } from "./useSlideshow";

const getSlideObserver =
  (
    setMarkedToLoadSlideMap: Dispatch<SetStateAction<boolean[]>>
  ): IntersectionObserverCallback =>
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.3) {
        const index = entry.target.getAttribute(DATA_IDX_ATTR);
        if (index) {
          const numIndex = parseInt(index);
          setMarkedToLoadSlideMap((prev) => {
            if (prev[numIndex]) return prev;
            prev[numIndex] = true;
            return [...prev];
          });
        }
      }
    });
  };

const getSlideStateObserver =
  (slideshowState: SlideshowState): IntersectionObserverCallback =>
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.95) {
        const index = entry.target.getAttribute(DATA_IDX_ATTR);
        if (index) {
          const numIndex = parseInt(index);
          slideshowState.activeSlideIdx = numIndex;
        }
      }
    });
  };

export const useScrollSetup = (
  length: number,
  setMarkedToLoadSlideMap: Dispatch<SetStateAction<boolean[]>>,
  setSlideIdxInternal: (idx: number, shouldPerformScroll?: boolean) => void,
  slideshowState: SlideshowState,
  slidesRef: MutableRefObject<HTMLImageElement[]>,
  slidesContainerRef: RefObject<HTMLDivElement>,
  options: SlideshowOptions,
  enabled?: boolean
) => {
  useEffect(() => {
    if (enabled) {
      slidesRef.current = slidesRef.current.slice(0, length);
      // Load slides on intersection and set slides index
      const slideLoaderObserver = new IntersectionObserver(
        getSlideObserver(setMarkedToLoadSlideMap),
        {
          root: slidesContainerRef.current,
          rootMargin: "0px",
          threshold: 0.3,
        }
      );

      const slideStateObserver = new IntersectionObserver(
        getSlideStateObserver(slideshowState),
        {
          root: slidesContainerRef.current,
          rootMargin: "0px",
          threshold: 0.95,
        }
      );

      slidesRef.current.forEach((slide) => {
        slideLoaderObserver.observe(slide);
        slideStateObserver.observe(slide);
      });

      return () => {
        slideLoaderObserver.disconnect();
        slideStateObserver.disconnect();
      };
    }
  }, [enabled, length, slideshowState]);

  const unsetScrollingTarget = useCallback(
    (e?: MouseEvent | TouchEvent) => {
      const prevActiveSlideIdx = slideshowState.activeSlideIdx;
      slideshowState.prevActiveSlideIdx = slideshowState.activeSlideIdx;
      slidesContainerRef.current &&
        waitForScrollEnd(slidesContainerRef.current).then(() => {
          if (prevActiveSlideIdx === slideshowState.prevActiveSlideIdx) {
            slideshowState.isManualScrolling = false;
            setSlideIdxInternal(slideshowState.activeSlideIdx);
          }
        });
    },
    [slideshowState, setSlideIdxInternal]
  );

  useEffect(() => {
    if (enabled && slidesContainerRef.current) {
      slidesContainerRef.current.onscroll = () => {
        if (slideshowState.isManualScrolling && !slideshowState.isScrolling) {
          options.onSlideScrollStart &&
            options.onSlideScrollStart(slideshowState.activeSlideIdx);
          slideshowState.isManualScrolling = false;
        }

        slideshowState.isScrolling = true;
      };

      slidesContainerRef.current.onmousedown = () => {
        slideshowState.isManualScrolling = true;
      };

      slidesContainerRef.current.ontouchstart = () => {
        slideshowState.isManualScrolling = true;
      };

      slidesContainerRef.current.onmouseup = () => {
        if (slideshowState.isScrolling) {
          unsetScrollingTarget();
        }
      };

      slidesContainerRef.current.ontouchend = () => {
        if (slideshowState.isScrolling) {
          unsetScrollingTarget();
        }
      };
    }
  }, [options.onSlideScrollStart, enabled]);
};
