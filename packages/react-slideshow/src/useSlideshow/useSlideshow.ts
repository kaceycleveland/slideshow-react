import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContainerScroll } from "./useContainerScroll";
import { useDebounce } from "../utils/useDebounce";
import { DATA_IDX_ATTR, DATA_SRC_ATTR } from "./Constants";
import { SlideOptions } from "./SlideOptions";
import { SlideshowOptions } from "./SlideshowOptions";
import {
  assignBlurSrc,
  assignDefaultClasses,
  assignPreloadingDepth,
  assignThumbnailClick,
} from "./utils";
import { DEFAULT_SLIDESHOW_OPTIONS } from "./utils/defaultSlideshowOptions";
import { loadImage } from "./utils/loadImage";
import { useScrollSetup } from "./useScrollSetup";

const onIntersection: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio >= 0.5) {
      observer.unobserve(entry.target);
      loadImage(entry.target as HTMLImageElement);
    }
  });
};

export interface SlideshowState {
  transitioning: boolean;
  manualScrolling: boolean;
  scrollingElement: EventTarget | null;
}

export const useSlideshow = (
  slideOptions: SlideOptions[],
  passedOptions?: SlideshowOptions
) => {
  const slideshowState = useMemo<SlideshowState>(
    () => ({
      transitioning: false,
      manualScrolling: false,
      scrollingElement: null,
    }),
    []
  );
  const rootSlidesContainerRef = useRef<HTMLDivElement>(null);
  const rootThumbnailContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLImageElement[]>([]);
  const thumbnailRefs = useRef<HTMLImageElement[]>([]);
  const options = useMemo(
    () => ({
      ...DEFAULT_SLIDESHOW_OPTIONS,
      ...passedOptions,
      defaultClasses: {
        ...DEFAULT_SLIDESHOW_OPTIONS.defaultClasses,
        ...passedOptions?.defaultClasses,
      },
    }),
    [passedOptions]
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState(
    options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex
  );

  const setSlideIdx = useCallback(
    (idx: number) => {
      let usedIdx = idx;
      if (idx >= slideOptions.length) usedIdx = 0;
      else if (idx < 0) usedIdx = slideOptions.length - 1;
      if (usedIdx !== activeSlideIdx) slideshowState.transitioning = true;
      setActiveSlideIdx(usedIdx);
      // slideshowState.focusedImageElement = slidesRef.current[usedIdx];
    },
    [setActiveSlideIdx, activeSlideIdx, slideshowState, slidesRef]
  );

  const debouncedActiveSlideIdx = useDebounce(activeSlideIdx, 100);

  // useEffect(() => {
  //   slideshowState.transitioning = false;
  // }, [debouncedActiveSlideIdx]);

  const slides: SlideOptions[] = useMemo(() => {
    assignPreloadingDepth(
      slideOptions,
      options.preloadDepth,
      debouncedActiveSlideIdx,
      options.nextImageIdxFn,
      options.previousImageIdxFn
    );

    const assignedSlides: SlideOptions[] = slideOptions.map(
      (slideOption, slideIndex) => {
        const base: SlideOptions = { ...slideOption };

        // Assign active state to corresponding slide
        base.main.active = slideIndex === debouncedActiveSlideIdx;
        base.main.dataIdx = slideIndex;

        // Generate and assign blur images to each slide if not defined
        assignBlurSrc(base.main, options?.getBlurSrc);

        // Assign default classes to each slide if they are not defined
        assignDefaultClasses(base.main, options?.defaultClasses);

        base.main.ref = (el) => {
          if (el) slidesRef.current[slideIndex] = el;
        };

        if (base.thumbnail) {
          base.thumbnail.active = slideIndex === debouncedActiveSlideIdx;
          assignBlurSrc(base.thumbnail, options?.getThumbnailBlurSrc);
          assignDefaultClasses(
            base.thumbnail,
            options?.defaultThumbnailClasses
          );
          assignThumbnailClick(base.thumbnail, slideIndex, setSlideIdx);
          base.thumbnail.ref = (el) => {
            if (el) thumbnailRefs.current[slideIndex] = el;
          };
        }

        return base;
      }
    );

    return assignedSlides;
  }, [debouncedActiveSlideIdx, slideOptions, thumbnailRefs, options]);

  useScrollSetup(
    slides.length,
    setSlideIdx,
    slideshowState,
    slidesRef,
    rootSlidesContainerRef,
    thumbnailRefs,
    rootThumbnailContainerRef
  );

  const activeSlide = useMemo(
    () => slideOptions[debouncedActiveSlideIdx],
    [debouncedActiveSlideIdx]
  );

  const { containerRef } = useContainerScroll(
    debouncedActiveSlideIdx,
    slideshowState,
    slidesRef,
    {
      passedContainerRef: rootSlidesContainerRef,
    }
  );

  const { containerRef: thumbnailContainerRef } = useContainerScroll(
    debouncedActiveSlideIdx,
    slideshowState,
    thumbnailRefs,
    {
      passedContainerRef: rootThumbnailContainerRef,
    }
  );

  return {
    slides,
    slideshowState,
    rootSlidesContainerRef: containerRef,
    rootThumbnailContainerRef: thumbnailContainerRef,
    thumbnailRefs,
    active: activeSlide,
    index: debouncedActiveSlideIdx,
    setSlideIdx,
  };
};
