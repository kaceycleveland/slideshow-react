import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
} from "react";
import debounce from "../utils/debounce";
import { performScroll, ScrollAlignment } from "../utils/performScroll";
import { DATA_IDX_ATTR } from "./Constants";
import { SlideshowState } from "./useSlideshow";

const getThumbnailObserver =
  (
    setLoadedThumbnailMap: Dispatch<SetStateAction<boolean[]>>
  ): IntersectionObserverCallback =>
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.5) {
        const index = entry.target.getAttribute(DATA_IDX_ATTR);
        if (index) {
          const numIndex = parseInt(index);
          setLoadedThumbnailMap((prev) => {
            if (prev[numIndex]) return prev;
            prev[numIndex] = true;
            return [...prev];
          });
          observer.unobserve(entry.target);
        }
      }
    });
  };

const getSlideObserver =
  (
    setLoadedSlideMap: Dispatch<SetStateAction<boolean[]>>,
    slideshowState: SlideshowState
  ): IntersectionObserverCallback =>
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.5) {
        const index = entry.target.getAttribute(DATA_IDX_ATTR);
        if (index) {
          const numIndex = parseInt(index);
          setLoadedSlideMap((prev) => {
            if (prev[numIndex]) return prev;
            prev[numIndex] = true;
            return [...prev];
          });
          slideshowState.activeSlideIdx = numIndex;
        }
      }
    });
  };

export const useScrollSetup = (
  length: number,
  setLoadedThumbnailMap: Dispatch<SetStateAction<boolean[]>>,
  setLoadedSlideMap: Dispatch<SetStateAction<boolean[]>>,
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
    const observer = new IntersectionObserver(
      getThumbnailObserver(setLoadedThumbnailMap),
      {
        root: thumbnailsContainerRef.current,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );
    thumbnailsRef.current.forEach((thumbnail) => observer.observe(thumbnail));
  }, [length, thumbnailsRef.current, thumbnailsContainerRef.current]);

  useEffect(() => {
    if (enabled) {
      slidesRef.current = slidesRef.current.slice(0, length);
      // Load slides on intersection and set slides index
      const observer = new IntersectionObserver(
        getSlideObserver(setLoadedSlideMap, slideshowState),
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

      slidesContainerRef.current.onmousedown = setScrollingTarget;
      slidesContainerRef.current.ontouchstart = setScrollingTarget;

      slidesContainerRef.current.onmouseup = debounce(
        unsetScrollingTarget,
        100
      );
      slidesContainerRef.current.ontouchend = debounce(
        unsetScrollingTarget,
        500
      );
    }
  }, [enabled, slidesContainerRef, setActiveSlideIdx, scrollAlignment]);

  useEffect(() => {
    if (enabled && thumbnailsContainerRef.current) {
      const setScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingThumbnails = true;
      };

      const unsetScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingThumbnails = false;
      };

      thumbnailsContainerRef.current.onmousedown = setScrollingTarget;
      thumbnailsContainerRef.current.ontouchstart = setScrollingTarget;

      thumbnailsContainerRef.current.onmouseup = unsetScrollingTarget;
      thumbnailsContainerRef.current.ontouchend = debounce(
        unsetScrollingTarget,
        1200
      );
    }
  }, [enabled, thumbnailsContainerRef]);
};
