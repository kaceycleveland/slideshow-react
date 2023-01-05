import { ImageComponentProps } from "../ImageComponentProps";
import { SlideshowImageProps } from "../SlideshowImage";
import { SlideshowThumbnailProps } from "../SlideshowThumbnail";

export interface ImageMetadata {
  dataSrc: string;
  classes?: {
    container?: string;
    blurImg?: string;
    mainImg?: string;
  };
  blurImgProps?: ImageComponentProps;
  imgProps?: ImageComponentProps;
  active?: boolean;
  containerId?: string;
}

export interface ThumbnailMetadata extends ImageMetadata {
  onThumbnailClick?: () => void;
}

export interface RequiredImageProps {
  imgProps: ImageComponentProps;
}

export interface SlideOptions {
  main: SlideshowImageProps;
  thumbnail?: SlideshowThumbnailProps;
}
