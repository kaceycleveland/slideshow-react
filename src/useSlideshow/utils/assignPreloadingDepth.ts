import { SlideOptions } from "../SlideOptions";
import { NavigateImageFn } from "../SlideshowOptions";

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
    activeSlide.loaded = true;
    for (let i = 0; i < preloadDepth; i++) {
      const nextImageIdx = nextImageIdxFn(slideOptions, nextTrack);
      const prevImageIdx = prevImageIdxFn(slideOptions, prevTrack);
      if (nextImageIdx) {
        nextTrack = nextImageIdx;
        const nextSlide = slideOptions[nextTrack];
        if ("main" in nextSlide) nextSlide.loaded = true;
      }
      if (prevImageIdx) {
        prevTrack = prevImageIdx;
        const prevSlide = slideOptions[prevTrack];
        if ("main" in prevSlide) prevSlide.loaded = true;
      }
    }
  }
  return slideOptions;
};
