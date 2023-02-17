import { ImageMetadata } from "../SlideOptions";

export const assignSrc = (imageMetadata: ImageMetadata) => {
  if (!imageMetadata.imgProps) imageMetadata.imgProps = {};
  imageMetadata.imgProps.src = imageMetadata.src;
};
