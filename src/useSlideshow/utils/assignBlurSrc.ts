import { ImageMetadata } from "../SlideOptions";
import { SlideshowOptions } from "../SlideshowOptions";

export const assignBlurSrc = (
  imageData: ImageMetadata,
  getBlurSrc?: SlideshowOptions["getBlurSrc"]
) => {
  if (!imageData.blurImgProps) imageData.blurImgProps = {};
  const blurImg = imageData.blurImgProps;
  if (getBlurSrc && !blurImg.src) {
    blurImg.src = getBlurSrc(imageData);
  }
};
