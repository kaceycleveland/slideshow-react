import { ReactNode, Ref } from "react";
import { ImageComponentProps } from "../ImageComponentProps";

export interface ImageMetadata {
  className?: string;
  classes?: {
    container?: string;
    blurImg?: string;
    mainImg?: string;
  };
  blurImgProps?: ImageComponentProps;
  imgProps: ImageComponentProps;
  containerId?: string;
}

export interface ThumbnailMetadata extends ImageMetadata {
  onThumbnailClick?: () => void;
  loaded?: boolean;
}

export interface RequiredImageProps {
  imgProps: ImageComponentProps;
}

export interface SharedComponentOptions {
  dataIdx?: number;
  active?: boolean;
  ref?: Ref<any>;
  thumbnail?: ThumbnailMetadata;
  loaded?: boolean;
}

export interface SlideImageComponentOptions extends SharedComponentOptions {
  main: ImageMetadata;
}

export interface SlideshowComponentOptions extends SharedComponentOptions {
  component: ReactNode;
}

export type SlideOptions =
  | SlideImageComponentOptions
  | SlideshowComponentOptions;
