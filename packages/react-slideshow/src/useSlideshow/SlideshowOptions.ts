import { ImageMetadata, SlideOptions } from "./SlideOptions";
import { SlideshowClasses } from "./SlideshowClasses";

export type NavigateImageFn = (
  slides: SlideOptions[],
  activeIndex: number
) => number;

export interface SlideshowOptions {
  getBlurSrc?: (imageMetadata: ImageMetadata) => string;
  getThumbnailSrc?: (imageMetadata: ImageMetadata) => string;
  getThumbnailBlurSrc?: (imageMetadata: ImageMetadata) => string;
  getThumbnailClick?: (imageMetadata: ImageMetadata) => void;
  nextImageIdxFn?: NavigateImageFn;
  previousImageIdxFn?: NavigateImageFn;
  preloadDepth?: number;
  startingIndex?: number;
  defaultClasses?: SlideshowClasses;
  defaultThumbnailClasses?: SlideshowClasses;
  isScrolling?: boolean;
}
