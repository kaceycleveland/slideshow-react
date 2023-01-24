import { MutableRefObject, RefObject, useEffect } from "react";
import debounce from "../utils/debounce";
import { getScrollParent } from "../utils/getScrollParent";
import { performScroll } from "../utils/performScroll";
import waitForScrollEnd from "../utils/waitForScrollEnd";
import { DATA_IDX_ATTR } from "./Constants";
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
  (
    setActiveSlideIdx: (idx: number) => void,
    slideshowState: SlideshowState
  ): IntersectionObserverCallback =>
  (entries, observer) => {
    console.log("getSlidesSelectionObserver called");
    entries.forEach((entry) => {
      if (
        entry.intersectionRatio >= 0.5 &&
        entry.target instanceof HTMLImageElement
      ) {
        // console.log(entry.target);
        if (!entry.target.src) {
          console.log("LOADING IMAGE");
          loadImage(entry.target as HTMLImageElement);
        }

        const index = entry.target.getAttribute(DATA_IDX_ATTR);
        console.log("INTERSECTION BOSERVER", index);
        if (index) {
          slideshowState.activeSlideIdx = parseInt(index);
        }
        // Add condition on thumbnail click that this should not run
        // if (!slideshowState.manualScrollingSlides) {
        //   const scrollParent = getScrollParent(entry.target);
        //   if (scrollParent) {
        //     waitForScrollEnd(scrollParent).then(() => {
        //       const index = entry.target.getAttribute(DATA_IDX_ATTR);
        //       console.log("INTERSECTION BOSERVER", index);
        //       index && setActiveSlideIdx(parseInt(index));
        //     });
        //   }
        // }
      }
    });
  };

// const getThumbnailSelectionObserver =
//   (
//     setActiveThumbnailIdx: (idx: number) => void,
//     slideshowState: SlideshowState
//   ): IntersectionObserverCallback =>
//   (entries, observer) => {
//     entries.forEach((entry) => {
//       const index = entry.target.getAttribute(DATA_IDX_ATTR);
//       if (index && entry.intersectionRatio >= 0.5) {
//         if (observer.root && "className" in observer.root) {
//           console.log("OBSERVER ROOT", observer.root);
//           waitForScrollEnd(observer.root).then(() =>
//             setActiveThumbnailIdx(parseInt(index))
//           );
//         }
//       }
//     });
//   };

export const useScrollSetup = (
  length: number,
  setActiveSlideIdx: (idx: number) => void,
  setActiveThumbnailIdx: (idx: number) => void,
  slideshowState: SlideshowState,
  slidesRef: MutableRefObject<HTMLImageElement[]>,
  slidesContainerRef: RefObject<HTMLDivElement>,
  thumbnailsRef: MutableRefObject<HTMLImageElement[]>,
  thumbnailsContainerRef: RefObject<HTMLDivElement>,
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
        getSlidesSelectionObserver(setActiveSlideIdx, slideshowState),
        {
          root: slidesContainerRef.current,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      // Load thumbnails and set thumbnails index on slide coming into view
      // const selectionObserver = new IntersectionObserver(
      //   getThumbnailSelectionObserver(setActiveThumbnailIdx, slideshowState),
      //   {
      //     root: slidesContainerRef.current,
      //     rootMargin: "0px",
      //     threshold: 0.5,
      //   }
      // );
      slidesRef.current.forEach((slide) => {
        // selectionObserver.observe(slide);
        observer.observe(slide);
      });
    }
  }, [
    enabled,
    length,
    setActiveThumbnailIdx,
    slidesRef.current,
    slidesContainerRef.current,
  ]);

  useEffect(() => {
    if (enabled && slidesContainerRef.current) {
      // let isScrolling: any;
      // slidesContainerRef.current.onscroll = () => {
      //   // Clear our timeout throughout the scroll
      //   slideshowState.transitioning = true;
      //   window.clearTimeout(isScrolling);

      //   // Set a timeout to run after scrolling ends
      //   isScrolling = setTimeout(() => {
      //     // Run the callback
      //     slideshowState.transitioning = false;
      //     console.log("Scrolling has stopped.");
      //   }, 30);
      // };

      const setScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingSlides = true;
      };

      const unsetScrollingTarget = (e?: MouseEvent | TouchEvent) => {
        slideshowState.manualScrollingSlides = false;
        setActiveThumbnailIdx(slideshowState.activeSlideIdx);
        const targetThumbnail =
          thumbnailsRef.current[slideshowState.activeSlideIdx].parentElement;
        targetThumbnail &&
          thumbnailsContainerRef.current &&
          performScroll(
            thumbnailsContainerRef.current,
            targetThumbnail,
            "center"
          );
      };

      slidesContainerRef.current.onmousedown = () => {
        console.log("mouse down");
        setScrollingTarget();
      };
      slidesContainerRef.current.ontouchstart = () => {
        console.log("touch start");
        setScrollingTarget();
      };

      slidesContainerRef.current.onmouseup = () => {
        console.log("mouseup");
        unsetScrollingTarget();
      };
      slidesContainerRef.current.ontouchend = debounce(() => {
        console.log("calling touchend");
        unsetScrollingTarget();
      }, 500);
    }
  }, [slidesContainerRef, setActiveThumbnailIdx]);

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
