import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ParsedSlideOptions, SlideOptions } from './SlideOptions';
import { SlideshowOptions } from './SlideshowOptions';
import { assignBlurSrc, assignPreloadingDepth } from './utils';
import { DEFAULT_SLIDESHOW_OPTIONS } from './utils/defaultSlideshowOptions';
import { useScrollSetup } from './useScrollSetup';
import { LEFT_KEY, RIGHT_KEY } from './Constants';
import waitForScrollEnd from '../utils/waitForScrollEnd';
import debounce from '../utils/debounce';
import { performScroll, setScroll } from '../utils/performScroll';
import { assignSizes, assignSrcSet } from './utils/assignSrcSet';

export interface SlideshowState {
  prevActiveSlideIdx: number;
  activeSlideIdx: number;
  isScrolling: boolean;
  isManualScrolling: boolean;
}

/**
 * See more documentation at [Github Documentation](https://github.com/kaceycleveland/slideshow-react)
 */
export const useSlideshow = (
  slideOptions: SlideOptions[],
  passedOptions?: SlideshowOptions,
) => {
  const rootSlidesContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLImageElement[]>([]);
  const [slidesLoaded, setSlidesLoaded] = useState(false);

  const options = useMemo(
    () => ({
      ...DEFAULT_SLIDESHOW_OPTIONS,
      ...passedOptions,
    }),
    [passedOptions],
  );
  const slideshowState = useMemo<SlideshowState>(
    () => ({
      prevActiveSlideIdx: -1,
      activeSlideIdx:
        options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex ?? 0,
      isScrolling: false,
      isManualScrolling: false,
      isAutoScrolling: false,
    }),
    [],
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState(
    options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex,
  );
  const [markedToLoadSlideMap, setMarkedToLoadSlideMap] = useState<boolean[]>(
    [],
  );
  const [loadedSlideMap, setLoadedSlideMap] = useState<boolean[]>([]);

  const performSlideshowScroll = useCallback(
    async (index: number, shouldPerformScroll = false) => {
      // console.log("SCROLLING TO ", index);
      const foundParentSlideElement = slidesRef.current[index];
      if (rootSlidesContainerRef.current && foundParentSlideElement) {
        // await waitForScrollEnd(rootSlidesContainerRef.current);
        await waitForScrollEnd(rootSlidesContainerRef.current);
        if (shouldPerformScroll) {
          performScroll(
            rootSlidesContainerRef.current,
            foundParentSlideElement,
            'center',
          );
        }
        await waitForScrollEnd(rootSlidesContainerRef.current);
        // await new Promise((r) => setTimeout(r, 200));
        slideshowState.isScrolling = false;
        if (
          options.onSlideScrollEnd &&
          slideshowState.activeSlideIdx === index
        ) {
          options.onSlideScrollEnd(index);
        }
      }
    },
    [options.onSlideScrollEnd],
  );

  useEffect(() => {
    const foundParentSlideElement = slidesRef.current[activeSlideIdx];
    if (rootSlidesContainerRef.current && foundParentSlideElement) {
      setScroll(
        rootSlidesContainerRef.current,
        foundParentSlideElement,
        'center',
      );
    }
  }, []);

  const getNextIndex = useCallback(
    (index: number) => {
      let nextIdx = index;
      if (index >= slideOptions.length) nextIdx = 0;
      else if (index < 0) nextIdx = slideOptions.length - 1;
      return nextIdx;
    },
    [slideOptions.length],
  );

  const setSlideIdxInternal = useCallback(
    (idx: number, shouldPerformScroll = false) => {
      let nextIdx = getNextIndex(idx);
      setActiveSlideIdx((prevIndex) => {
        // Handles callback on auto scrolling (button press or some other index setting)
        if (shouldPerformScroll && options.onSlideScrollStart) {
          options.onSlideScrollStart(prevIndex);
        }
        performSlideshowScroll(nextIdx, shouldPerformScroll);
        return nextIdx;
      });
    },
    [getNextIndex, performSlideshowScroll, options.onSlideScrollStart],
  );

  const setSlideIdx = useCallback(
    debounce((idx: number) => setSlideIdxInternal(idx, true), 200),
    [setSlideIdxInternal],
  );

  const preloadedSlides = useMemo(() => {
    return assignPreloadingDepth(
      slideOptions,
      options.preloadDepth,
      activeSlideIdx,
      getNextIndex,
      setMarkedToLoadSlideMap,
    );
  }, [slideOptions, options.preloadDepth, activeSlideIdx, getNextIndex]);

  const parsedSlides = useMemo(() => {
    const assignedSlides = preloadedSlides.map((slideOption, slideIndex) => {
      const base = {
        ...slideOption,
        dataIdx: -1,
        isSetToLoad: false,
        loaded: false,
        ref: () => undefined,
      };

      base.dataIdx = slideIndex;
      base.isSetToLoad = markedToLoadSlideMap[slideIndex] ?? false;
      base.loaded = loadedSlideMap[slideIndex] ?? false;

      if ('image' in base) {
        const prevOnLoad = base.image.onLoad;
        base.image.onLoad = (e) => {
          if (prevOnLoad) prevOnLoad(e);
          setLoadedSlideMap((prev) => {
            prev[slideIndex] = true;
            return [...prev];
          });
        };
        // Generate and assign blur images to each slide if not defined
        assignBlurSrc(base, options?.getBlurSrc);
        assignSrcSet(base, options?.getSrcSet, options?.getBlurSrcSet);
        assignSizes(base, options?.getSizes, options?.getBlurSizes);
      }

      base.ref = (el?: any) => {
        if (el) slidesRef.current[slideIndex] = el;
        if (slidesRef.current.length === preloadedSlides.length)
          setSlidesLoaded(true);
        return undefined;
      };

      return base;
    });

    return assignedSlides;
  }, [
    preloadedSlides,
    markedToLoadSlideMap,
    loadedSlideMap,
    options.getBlurSrc,
    options.getSrcSet,
    options.getSizes,
    options?.getBlurSrcSet,
    options?.getBlurSizes,
  ]);

  const activeSlides = useMemo(() => {
    const assignedSlides = parsedSlides.map((slideOption, slideIndex) => {
      const base = { ...slideOption, active: false };
      // Assign active state to corresponding slide
      base.active = slideIndex === activeSlideIdx;
      base.dataIdx = slideIndex;

      return base;
    });
    return assignedSlides;
  }, [getNextIndex, parsedSlides, options.preloadDepth, activeSlideIdx]);

  useScrollSetup(
    activeSlides.length,
    setMarkedToLoadSlideMap,
    setSlideIdxInternal,
    slideshowState,
    slidesRef,
    rootSlidesContainerRef,
    options,
    slidesLoaded,
  );

  const activeSlide = useMemo(
    () => activeSlides[activeSlideIdx],
    [activeSlides, activeSlideIdx],
  );

  const goNextSlide = useCallback(
    () => setSlideIdx(activeSlideIdx + 1),
    [activeSlides, activeSlideIdx],
  );

  const goPreviousSlide = useCallback(
    () => setSlideIdx(activeSlideIdx - 1),
    [activeSlides, activeSlideIdx],
  );

  const setNextSlideIdxFocus = useCallback(
    (e: KeyboardEvent) => {
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
    },
    [setSlideIdx, activeSlideIdx],
  );

  useEffect(() => {
    if (rootSlidesContainerRef.current) {
      rootSlidesContainerRef.current.tabIndex = 0;
      rootSlidesContainerRef.current.onkeydown = setNextSlideIdxFocus;
    }
  }, [setNextSlideIdxFocus, rootSlidesContainerRef]);

  return {
    /**
     * Derived slides from the given passed options and the original slides array.
     */
    slides: activeSlides as ParsedSlideOptions[],
    rootSlidesContainerRef: rootSlidesContainerRef,
    /**
     * Current active slide object.
     */
    active: activeSlide as SlideOptions,
    /**
     * Current active slide index.
     */
    index: activeSlideIdx,
    /**
     * Set the active slide to the given index.
     * Index setting is bound to the length of the slides array.
     */
    setSlideIdx,
    /**
     * Sets the active slide to the next slide given by options?.nextImageIdxFn
     */
    goNextSlide,
    /**
     * Sets the active slide to the previous slide given by options?.previousImageIdxFn
     */
    goPreviousSlide,
  };
};
