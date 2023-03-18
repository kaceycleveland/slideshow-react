import { ReactNode, Ref } from "react";
import { ImageComponentProps } from "../ImageComponentProps";

// Rework this and make it extend ImageProps
export interface ImageMetadata extends ImageComponentProps {}

export interface SharedComponentOptions {
  dataIdx?: number;
  active?: boolean;
  ref?: Ref<any>;
  loaded?: boolean;
  isSetToLoad?: boolean;
}

export interface SlideImageComponentOptions extends SharedComponentOptions {
  image: ImageMetadata;
  blurImage?: ImageMetadata;
  original?: ImageMetadata;
}

export interface SlideshowComponentOptions extends SharedComponentOptions {
  component: ReactNode;
}

export type SlideOptions =
  | SlideImageComponentOptions
  | SlideshowComponentOptions;
