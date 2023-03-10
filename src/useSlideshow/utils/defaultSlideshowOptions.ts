import { ScrollAlignment } from "../../utils/performScroll";
import { NavigateImageFn, SlideshowOptions } from "../SlideshowOptions";

const nextImageIdxFn: NavigateImageFn = (slides, activeIdx) => {
  const nextIdx = activeIdx + 1;
  if (nextIdx > slides.length - 1) return 0;
  else return nextIdx;
};

const previousImageIdxFn: NavigateImageFn = (slides, activeIdx) => {
  const prevIdx = activeIdx - 1;
  if (prevIdx < 0) return slides.length - 1;
  else return prevIdx;
};

const getThumbnailClick: SlideshowOptions["getThumbnailClick"] = (
  imageMetadata
) => {};

export const DEFAULT_SLIDESHOW_OPTIONS = {
  preloadDepth: 1,
  nextImageIdxFn,
  previousImageIdxFn,
  startingIndex: 0,
  defaultClasses: {
    container: "image-container",
    mainImg: "main-image",
    blurImg: "blur-image",
  },
  defaultThumbnailClasses: {
    container: "thumbnail-image-container",
    mainImg: "thumbnail-main-image",
    blurImg: "thumbnail-blur-image",
  },
  getThumbnailClick,
  scrollAlignment: "center" as ScrollAlignment,
};
