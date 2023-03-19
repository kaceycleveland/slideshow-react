import { SlideImageComponentOptions } from '../SlideOptions';
import { SlideshowOptions } from '../SlideshowOptions';

export const assignBlurSrc = (
  slideImage: SlideImageComponentOptions,
  getBlurSrc?: SlideshowOptions['getBlurSrc'],
) => {
  if (!slideImage.blurImage) slideImage.blurImage = {};
  const blurImg = slideImage.blurImage;
  if (getBlurSrc && !blurImg.src) {
    blurImg.src = getBlurSrc(slideImage.image);
  }
};
