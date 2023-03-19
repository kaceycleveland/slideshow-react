import { Dispatch, SetStateAction } from 'react';
import { SlideOptions } from '../SlideOptions';
import { NavigateImageFn } from '../SlideshowOptions';

export const assignPreloadingDepth = (
  slideOptions: SlideOptions[],
  preloadDepth: number,
  activeIdx: number,
  getNextIndex: (index: number) => number,
  setMarkedToLoadSlideMap: Dispatch<SetStateAction<boolean[]>>,
) => {
  const idxToLoad: boolean[] = [];
  let nextTrack = activeIdx;
  let prevTrack = activeIdx;
  idxToLoad[activeIdx] = true;
  // Fix this to recurse out
  for (let i = activeIdx; i < activeIdx + preloadDepth; i++) {
    const nextImageIdx = getNextIndex(i + 1);
    const prevImageIdx = getNextIndex(i - 1);
    idxToLoad[nextImageIdx] = true;
    idxToLoad[prevImageIdx] = true;
    nextTrack = nextImageIdx;
    prevTrack = prevImageIdx;
  }
  setMarkedToLoadSlideMap((prevMap) => {
    idxToLoad.forEach((bool, idx) => {
      if (bool) {
        prevMap[idx] = bool;
      }
    });
    return [...prevMap];
  });
  return [...slideOptions];
};
