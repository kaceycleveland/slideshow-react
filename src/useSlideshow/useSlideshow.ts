import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlideOptions } from "./SlideOptions";
import { SlideshowOptions } from "./SlideshowOptions";
import {
  assignBlurSrc,
  assignDefaultClasses,
  assignPreloadingDepth,
  assignThumbnailClick,
} from "./utils";
import { DEFAULT_SLIDESHOW_OPTIONS } from "./utils/defaultSlideshowOptions";
import { useScrollSetup } from "./useScrollSetup";
import { performScroll } from "../utils/performScroll";
import { LEFT_KEY, RIGHT_KEY } from "./Constants";

export interface SlideshowState {
  manualScrollingSlides: boolean;
  manualScrollingThumbnails: boolean;
  activeSlideIdx: number;
}

export const useSlideshow = (
  slideOptions: SlideOptions[],
  passedOptions?: SlideshowOptions
) => {
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
  const slideshowState = useMemo<SlideshowState>(
    () => ({
      manualScrollingSlides: false,
      manualScrollingThumbnails: false,
      activeSlideIdx:
        options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex ?? 0,
    }),
    []
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState(
    options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex
  );

  const setSlideIdx = useCallback(
    async (idx: number) => {
      let usedIdx = idx;
      if (idx >= slideOptions.length) usedIdx = 0;
      else if (idx < 0) usedIdx = slideOptions.length - 1;
      setActiveSlideIdx(usedIdx);
      const foundParentSlideElement = slidesRef.current[usedIdx].parentElement;
      if (rootSlidesContainerRef.current && foundParentSlideElement) {
        performScroll(
          rootSlidesContainerRef.current,
          foundParentSlideElement,
          "center"
        );
      }

      const foundThumbnailElement = thumbnailRefs.current[usedIdx];
      if (
        rootThumbnailContainerRef.current &&
        foundThumbnailElement &&
        foundThumbnailElement.parentElement
      ) {
        performScroll(
          rootThumbnailContainerRef.current,
          foundThumbnailElement.parentElement,
          options.scrollAlignment
        );
      }
    },
    [
      rootSlidesContainerRef,
      rootThumbnailContainerRef,
      thumbnailRefs,
      slidesRef,
      setActiveSlideIdx,
      activeSlideIdx,
      slideshowState,
      slidesRef,
    ]
  );

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
  }, [slideOptions, setSlideIdx, thumbnailRefs, options]);

  const activeSlides: SlideOptions[] = useMemo(() => {
    assignPreloadingDepth(
      parsedSlides,
      options.preloadDepth,
      activeSlideIdx,
      options.nextImageIdxFn,
      options.previousImageIdxFn
    );

    const assignedSlides: SlideOptions[] = parsedSlides.map(
      (slideOption, slideIndex) => {
        const base: SlideOptions = { ...slideOption };

        // Assign active state to corresponding slide
        base.main.active = slideIndex === activeSlideIdx;
        base.main.dataIdx = slideIndex;

        if (base.thumbnail) {
          base.thumbnail.active = slideIndex === activeSlideIdx;
        }

        return base;
      }
    );
    return assignedSlides;
  }, [
    parsedSlides,
    options.preloadDepth,
    activeSlideIdx,
    options.nextImageIdxFn,
    options.previousImageIdxFn,
  ]);

  useScrollSetup(
    activeSlides.length,
    setActiveSlideIdx,
    slideshowState,
    slidesRef,
    rootSlidesContainerRef,
    thumbnailRefs,
    rootThumbnailContainerRef,
    options.scrollAlignment,
    passedOptions?.isScrolling
  );

  const activeSlide = useMemo(
    () => activeSlides[activeSlideIdx],
    [activeSlides, activeSlideIdx]
  );

  useEffect(() => {
    const setNextSlideIdx = (e: KeyboardEvent) => {
      if (document.activeElement === e.target) {
        if (e.code === LEFT_KEY) {
          e.preventDefault();
          setSlideIdx(activeSlideIdx - 1);
        }
        if (e.code === RIGHT_KEY) {
          e.preventDefault();
          setSlideIdx(activeSlideIdx + 1);
        }
      }
    };
    if (rootThumbnailContainerRef.current) {
      rootThumbnailContainerRef.current.tabIndex = 0;
      rootThumbnailContainerRef.current.onkeydown = setNextSlideIdx;
    }
    if (rootSlidesContainerRef.current) {
      rootSlidesContainerRef.current.tabIndex = 0;
      rootSlidesContainerRef.current.onkeydown = setNextSlideIdx;
    }
  }, [
    rootSlidesContainerRef,
    rootThumbnailContainerRef,
    setSlideIdx,
    activeSlideIdx,
  ]);

  return {
    slides: activeSlides,
    slideshowState,
    rootSlidesContainerRef: rootSlidesContainerRef,
    rootThumbnailContainerRef: rootThumbnailContainerRef,
    thumbnailRefs,
    active: activeSlide,
    index: activeSlideIdx,
    setSlideIdx,
  };
};
