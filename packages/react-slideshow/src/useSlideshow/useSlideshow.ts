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

  const parsedSlides: SlideOptions[] = useMemo(() => {
    const assignedSlides: SlideOptions[] = slideOptions.map(
      (slideOption, slideIndex) => {
        const base: SlideOptions = { ...slideOption };

        base.main.dataIdx = slideIndex;

        // Generate and assign blur images to each slide if not defined
        assignBlurSrc(base.main, options?.getBlurSrc);

        // Assign default classes to each slide if they are not defined
        assignDefaultClasses(base.main, options?.defaultClasses);

        base.main.ref = (el) => {
          if (el) slidesRef.current[slideIndex] = el;
        };

        if (base.thumbnail) {
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
  }, [slideOptions, thumbnailRefs, options]);

  const activeSlides: SlideOptions[] = useMemo(() => {
    assignPreloadingDepth(
      parsedSlides,
      options.preloadDepth,
      debouncedActiveSlideIdx,
      options.nextImageIdxFn,
      options.previousImageIdxFn
    );

    const assignedSlides: SlideOptions[] = parsedSlides.map(
      (slideOption, slideIndex) => {
        const base: SlideOptions = { ...slideOption };

        // Assign active state to corresponding slide
        base.main.active = slideIndex === debouncedActiveSlideIdx;
        base.main.dataIdx = slideIndex;

        if (base.thumbnail) {
          base.thumbnail.active = slideIndex === debouncedActiveSlideIdx;
        }

        return base;
      }
    );
    return assignedSlides;
  }, [
    parsedSlides,
    options.preloadDepth,
    debouncedActiveSlideIdx,
    options.nextImageIdxFn,
    options.previousImageIdxFn,
  ]);

  useScrollSetup(
    activeSlides.length,
    setSlideIdx,
    slideshowState,
    slidesRef,
    rootSlidesContainerRef,
    thumbnailRefs,
    rootThumbnailContainerRef,
    passedOptions?.isScrolling
  );

  const activeSlide = useMemo(
    () => activeSlides[debouncedActiveSlideIdx],
    [activeSlides, debouncedActiveSlideIdx]
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
    slides: activeSlides,
    slideshowState,
    rootSlidesContainerRef: containerRef,
    rootThumbnailContainerRef: thumbnailContainerRef,
    thumbnailRefs,
    active: activeSlide,
    index: debouncedActiveSlideIdx,
    setSlideIdx,
  };
};
