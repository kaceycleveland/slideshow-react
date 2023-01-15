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
  assignSrc(slideOptions[activeIdx].main);
  for (let i = 0; i < preloadDepth; i++) {
    const nextImageIdx = nextImageIdxFn(slideOptions, nextTrack);
    const prevImageIdx = prevImageIdxFn(slideOptions, prevTrack);
    if (nextImageIdx) {
      nextTrack = nextImageIdx;
      assignSrc(slideOptions[nextImageIdx].main);
    }
    if (prevImageIdx) {
      prevTrack = prevImageIdx;
      assignSrc(slideOptions[prevImageIdx].main);
    }
  }
  return slideOptions;
};
