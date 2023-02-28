import { ScrollAlignment } from "../utils/performScroll";
import { ImageMetadata, SlideOptions } from "./SlideOptions";
import { SlideshowClasses } from "./SlideshowClasses";

export type NavigateImageFn = (
  slides: SlideOptions[],
  activeIndex: number
) => number;

export interface SlideshowOptions {
  /**
   * Will derive a blurred src image for the given *ImageMetadata* found in the passed slides array to load prior to the high quality image.
   */
  getBlurSrc?: (imageMetadata: ImageMetadata) => string;
  /**
   * Will derive a thumbnail src image for the given *ImageMetadata* found in the passed slides array.
   */
  getThumbnailSrc?: (imageMetadata: ImageMetadata) => string;
  /**
   * Will derive a blurred src image for the given thumbnail *ImageMetadata* found in the derived slides array to load prior to the high quality image.
   */
  getThumbnailBlurSrc?: (imageMetadata: ImageMetadata) => string;
  getThumbnailClick?: (imageMetadata: ImageMetadata) => void;
  /**
   * Function to return the next index of the slides in the order they should be rendered and shown.
   *
   * *Default*: Sets the next image to i + 1 with bounds of 0 to the length of the slides array.
   */
  nextImageIdxFn?: NavigateImageFn;
  /**
   * Function to return the previous index of the slides in the order they should be rendered and shown.
   *
   * *Default*: Sets the next image to i - 1 with bounds of 0 to the length of the slides array.
   */
  previousImageIdxFn?: NavigateImageFn;
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
   * Override the default set of classes applied to each element in the main slides container.
   */
  defaultClasses?: SlideshowClasses;
  /**
   * Override the default set of classes applied to each element in the thumbnail slides container.
   */
  defaultThumbnailClasses?: SlideshowClasses;
  /**
   * Set to *true* if the slideshow is scrolling.
   *
   * *Default*: false
   */
  isScrolling?: boolean;
  /**
   * Set the position thumbnails should scroll to when clicked relative to the container.
   *
   * *Default*: "center"
   */
  scrollAlignment?: ScrollAlignment;
}
