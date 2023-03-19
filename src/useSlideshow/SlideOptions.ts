import { ReactNode, Ref } from 'react';
import { ImageComponentProps } from '../ImageComponentProps';

export interface ImageMetadata extends ImageComponentProps {
  ref?: Ref<HTMLImageElement>;
}

export interface SharedComponentOptions {
  /**
   * Should be attached to the root slide container as a `data-idx` attribute
   */
  dataIdx: number;
  /**
   * Indicates whether or not the given slide is in an "active" state.
   */
  active: boolean;
  /**
   * Should be attached to the root slide container's `ref` prop.
   */
  ref: Ref<any>;
  /**
   * Indicates if the given slide is set to load.
   * Can be used to conditionally render the main content of the slide as long as the root element of the slide is styled correctly to maintain it's dimensions.
   */
  isSetToLoad: boolean;
}

export interface SlideImageComponentOptions {
  image: ImageMetadata;
  blurImage?: ImageMetadata;
}

interface ParsedSlideImageComponentOptions extends SlideImageComponentOptions {
  /**
   * Indicates whether or not the given image is loaded.
   */
  loaded: boolean;
}

export interface SlideshowComponentOptions {
  /**
   * Pass a `component` to be rendered as the content of the slide.
   */
  component: ReactNode;
}

/**
 * Specify either an `image` slide or a `component` slide.
 */
export type SlideOptions =
  | SlideImageComponentOptions
  | SlideshowComponentOptions;

export type ParsedSlideOptions = (
  | ParsedSlideImageComponentOptions
  | SlideshowComponentOptions
) &
  SharedComponentOptions;
