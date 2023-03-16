import { ImageMetadata, SlideOptions } from "./SlideOptions";
import { SlideshowClasses } from "./SlideshowClasses";

export type NavigateImageFn = (
  slides: SlideOptions[],
  activeIndex: number
) => number;

export interface SlideshowOptions {
  /**
   *
   */
  onSlideScrollStart?: (index: number) => void;
  /**
   *
   */
  onSlideScrollEnd?: (index: number) => void;
  /**
   * Will derive a blurred src image for the given *ImageMetadata* found in the passed slides array to load prior to the high quality image.
   */
  getBlurSrc?: (imageMetadata: ImageMetadata) => string;
  /**
   * Will derive a blurred src image for the given thumbnail *ImageMetadata* found in the derived slides array to load prior to the high quality image.
   */
  getThumbnailBlurSrc?: (imageMetadata: ImageMetadata) => string;
  /**
   * Given the result of *nextImageIdxFn* and *previousImageIdxFn*, preload the slides at this given depth.
   *
   * *Default*: 1
   */
  preloadDepth?: number;
  /**
   * What index the slides should start at.
   */
  startingIndex?: number;
  /**
   * Set the position thumbnails should scroll to when clicked relative to the container.
   *
   * *Default*: "center"
   */
  scrollAlignment?: "left" | "right" | "center" | "top" | "bottom";
}
