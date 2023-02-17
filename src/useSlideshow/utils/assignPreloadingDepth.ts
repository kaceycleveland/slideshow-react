import { SlideOptions } from "../SlideOptions";
import { NavigateImageFn } from "../SlideshowOptions";
import { assignSrc } from "./assignSrc";

export const assignPreloadingDepth = (
  slideOptions: SlideOptions[],
  preloadDepth: number,
  activeIdx: number,
  nextImageIdxFn: NavigateImageFn,
  prevImageIdxFn: NavigateImageFn
) => {
  let nextTrack = activeIdx;
  let prevTrack = activeIdx;
  const activeSlide = slideOptions[activeIdx];
  if ("main" in activeSlide) {
    assignSrc(activeSlide.main);
    for (let i = 0; i < preloadDepth; i++) {
      const nextImageIdx = nextImageIdxFn(slideOptions, nextTrack);
      const prevImageIdx = prevImageIdxFn(slideOptions, prevTrack);
      if (nextImageIdx) {
        nextTrack = nextImageIdx;
        const nextSlide = slideOptions[nextTrack];
        "main" in nextSlide && assignSrc(nextSlide.main);
      }
      if (prevImageIdx) {
        prevTrack = prevImageIdx;
        const prevSlide = slideOptions[prevTrack];
        "main" in prevSlide && assignSrc(prevSlide.main);
      }
    }
  }
  return slideOptions;
};
