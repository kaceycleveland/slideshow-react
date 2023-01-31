import { useCallback, useMemo, useRef, useState } from "react";
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
  const [activeThumbnailIdx, setActiveThumbnailIdx] = useState(
    options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex
  );

  const setSlideIdx = useCallback(
    async (idx: number) => {
      let usedIdx = idx;
      if (idx >= slideOptions.length) usedIdx = 0;
      else if (idx < 0) usedIdx = slideOptions.length - 1;
      setActiveThumbnailIdx(usedIdx);
      const foundParentSlideElement = slidesRef.current[usedIdx].parentElement;
      if (rootSlidesContainerRef.current && foundParentSlideElement) {
        performScroll(
          rootSlidesContainerRef.current,
          foundParentSlideElement,
          "center"
        );
      }

      const foundThumbnailElement =
        thumbnailRefs.current[usedIdx].parentElement;
      if (rootThumbnailContainerRef.current && foundThumbnailElement) {
        performScroll(
          rootThumbnailContainerRef.current,
          foundThumbnailElement,
          options.scrollAlignment
        );
      }
    },
    [
      rootSlidesContainerRef,
      rootThumbnailContainerRef,
      thumbnailRefs,
      slidesRef,
      setActiveThumbnailIdx,
      activeThumbnailIdx,
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
      activeThumbnailIdx,
      options.nextImageIdxFn,
      options.previousImageIdxFn
    );

    const assignedSlides: SlideOptions[] = parsedSlides.map(
      (slideOption, slideIndex) => {
        const base: SlideOptions = { ...slideOption };

        // Assign active state to corresponding slide
        base.main.active = slideIndex === activeThumbnailIdx;
        base.main.dataIdx = slideIndex;

        if (base.thumbnail) {
          base.thumbnail.active = slideIndex === activeThumbnailIdx;
        }

        return base;
      }
    );
    return assignedSlides;
  }, [
    parsedSlides,
    options.preloadDepth,
    activeThumbnailIdx,
    activeThumbnailIdx,
    options.nextImageIdxFn,
    options.previousImageIdxFn,
  ]);

  useScrollSetup(
    activeSlides.length,
    setActiveThumbnailIdx,
    setActiveThumbnailIdx,
    slideshowState,
    slidesRef,
    rootSlidesContainerRef,
    thumbnailRefs,
    rootThumbnailContainerRef,
    passedOptions?.isScrolling
  );

  const activeSlide = useMemo(
    () => activeSlides[activeThumbnailIdx],
    [activeSlides, activeThumbnailIdx]
  );

  return {
    slides: activeSlides,
    slideshowState,
    rootSlidesContainerRef: rootSlidesContainerRef,
    rootThumbnailContainerRef: rootThumbnailContainerRef,
    thumbnailRefs,
    active: activeSlide,
    index: activeThumbnailIdx,
    setSlideIdx,
  };
};
