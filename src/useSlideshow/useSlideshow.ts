import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DATA_SRC_ATTR } from "./Constants";
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

const onIntersection: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio >= 0.5) {
      console.log("INTERSECT");
      observer.unobserve(entry.target);
      loadImage(entry.target as HTMLImageElement);
    }
  });
};

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
  const [activeSlideIdx, setActiveSlideIdx] = useState(
    options?.startingIndex ?? DEFAULT_SLIDESHOW_OPTIONS.startingIndex
  );

  console.log(options);

  const slides: SlideOptions[] = useMemo(() => {
    assignPreloadingDepth(
      slideOptions,
      options.preloadDepth,
      activeSlideIdx,
      options.nextImageIdxFn,
      options.previousImageIdxFn
    );

    const assignedSlides: SlideOptions[] = slideOptions.map(
      (slideOption, slideIndex) => {
        const base: SlideOptions = { ...slideOption };

        // Assign active state to corresponding slide
        base.main.active = slideIndex === activeSlideIdx;

        // Generate and assign blur images to each slide if not defined
        assignBlurSrc(base.main, options?.getBlurSrc);

        // Assign default classes to each slide if they are not defined
        assignDefaultClasses(base.main, options?.defaultClasses);

        base.main.ref = (el) => {
          if (el) slidesRef.current[slideIndex] = el;
        };

        if (base.thumbnail) {
          base.thumbnail.active = slideIndex === activeSlideIdx;
          assignBlurSrc(base.thumbnail, options?.getThumbnailBlurSrc);
          assignDefaultClasses(
            base.thumbnail,
            options?.defaultThumbnailClasses
          );
          assignThumbnailClick(base.thumbnail, slideIndex, setActiveSlideIdx);
          base.thumbnail.ref = (el) => {
            if (el) thumbnailRefs.current[slideIndex] = el;
          };
        }

        return base;
      }
    );

    return assignedSlides;
  }, [activeSlideIdx, slideOptions, thumbnailRefs, options]);

  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, slides.length);

    const observer = new IntersectionObserver(onIntersection, {
      root: rootThumbnailContainerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    });
    thumbnailRefs.current.forEach((thumbnail) => observer.observe(thumbnail));
  }, [slides, thumbnailRefs.current, rootThumbnailContainerRef.current]);

  useEffect(() => {
    slidesRef.current = slidesRef.current.slice(0, slides.length);
    console.log(slidesRef.current);
    const observer = new IntersectionObserver(onIntersection, {
      root: rootSlidesContainerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    });
    slidesRef.current.forEach((slide) => observer.observe(slide));
  }, [slides, slidesRef.current, rootSlidesContainerRef.current]);

  const setSlideIdx = useCallback(
    (idx: number) => {
      if (idx >= slideOptions.length) setActiveSlideIdx(0);
      else if (idx < 0) setActiveSlideIdx(slideOptions.length - 1);
      else setActiveSlideIdx(idx);
    },
    [setActiveSlideIdx]
  );

  const activeSlide = useMemo(
    () => slideOptions[activeSlideIdx],
    [activeSlideIdx]
  );

  return {
    slides,
    rootSlidesContainerRef,
    rootThumbnailContainerRef,
    thumbnailRefs,
    active: activeSlide,
    index: activeSlideIdx,
    setSlideIdx,
  };
};
