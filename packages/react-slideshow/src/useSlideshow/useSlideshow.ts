import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../utils/useDebounce";
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
import { useThumbnailContainerScroll } from "./useThumbnailContainerScroll";
import { useSlidesContainerScroll } from "./useSlidesContainerScroll";
import waitForScrollEnd from "../utils/waitForScrollEnd";
import { performScroll } from "../utils/performScroll";

export interface SlideshowState {
  manualScrollingSlides: boolean;
  manualScrollingThumbnails: boolean;
  activeSlideIdx: number;
  // slidesTransitioningFromClick: boolean;
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
        options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex,
      // slidesTransitioningFromClick: false,
    }),
    []
  );
  // const [activeSlideIdx, setActiveSlideIdx] = useState(
  //   options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex
  // );
  const [activeThumbnailIdx, setActiveThumbnailIdx] = useState(
    options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex
  );

  const setSlideIdx = useCallback(
    async (idx: number) => {
      let usedIdx = idx;
      if (idx >= slideOptions.length) usedIdx = 0;
      else if (idx < 0) usedIdx = slideOptions.length - 1;
      // slideshowState.slidesTransitioningFromClick = true;
      // setActiveSlideIdx(usedIdx);
      setActiveThumbnailIdx(usedIdx);
      const foundParentSlideElement = slidesRef.current[usedIdx].parentElement;
      if (rootSlidesContainerRef.current && foundParentSlideElement) {
        console.log(
          "performing scroll on slides",
          rootSlidesContainerRef.current,
          foundParentSlideElement
        );
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
          "center"
        );
      }

      // if (rootSlidesContainerRef.current) {
      //   waitForScrollEnd(rootSlidesContainerRef.current);
      // }
      // slideshowState.focusedImageElement = slidesRef.current[usedIdx];
    },
    [
      // setActiveSlideIdx,
      rootSlidesContainerRef,
      rootThumbnailContainerRef,
      thumbnailRefs,
      slidesRef,
      setActiveThumbnailIdx,
      // activeSlideIdx,
      activeThumbnailIdx,
      slideshowState,
      slidesRef,
    ]
  );

  // const debouncedActiveSlideIdx = useDebounce(activeSlideIdx, 100);
  // const debouncedActiveThumbnailIdx = useDebounce(activeThumbnailIdx, 100);

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

  // const { containerRef } = useSlidesContainerScroll(
  //   activeSlideIdx,
  //   slideshowState,
  //   slidesRef,
  //   {
  //     passedContainerRef: rootSlidesContainerRef,
  //   }
  // );

  // const { containerRef: thumbnailContainerRef } = useThumbnailContainerScroll(
  //   activeThumbnailIdx,
  //   slideshowState,
  //   thumbnailRefs,
  //   {
  //     passedContainerRef: rootThumbnailContainerRef,
  //   }
  // );

  return {
    slides: activeSlides,
    slideshowState,
    rootSlidesContainerRef: rootSlidesContainerRef,
    rootThumbnailContainerRef: rootThumbnailContainerRef,
    thumbnailRefs,
    active: activeSlide,
    index: activeThumbnailIdx,
    thumbnailIndex: activeThumbnailIdx,
    setSlideIdx,
  };
};
