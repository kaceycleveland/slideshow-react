import { ImageMetadata, SlideOptions } from './SlideOptions';
export type NavigateImageFn = (
  slides: SlideOptions[],
  activeIndex: number,
) => number;

export interface SlideshowOptions {
  /**
   * Triggers on slide starting a scroll transition
   */
  onSlideScrollStart?: (startingIndex: number) => void;
  /**
   * Triggers on slide ending a scroll transition
   */
  onSlideScrollEnd?: (endingIndex: number) => void;
  /**
   * Will derive a blurred src image for the given *ImageMetadata* found in the passed slides array to load prior to the high quality image.
   */
  getBlurSrc?: (imageMetadata: ImageMetadata) => string;
  /**
   * Will derive a blurred src image for the given thumbnail *ImageMetadata* found in the derived slides array to load prior to the high quality image.
   */
  getThumbnailBlurSrc?: (imageMetadata: ImageMetadata) => string;
  /**
   * Function to generate and assign a srcSet prop for image slides
   */
  getSrcSet?: (imageMetadata: ImageMetadata) => string | undefined;
  /**
   * Function to generate and assign a sizes prop for image slides
   */
  getSizes?: (imageMetadata: ImageMetadata) => string | undefined;
  /**
   * Function to generate and assign a srcSet prop for blur image slides
   */
  getBlurSrcSet?: (imageMetadata: ImageMetadata) => string | undefined;
  /**
   * Function to generate and assign a sizes prop for blur image slides
   */
  getBlurSizes?: (imageMetadata: ImageMetadata) => string | undefined;
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
  scrollAlignment?: 'left' | 'right' | 'center' | 'top' | 'bottom';
}
