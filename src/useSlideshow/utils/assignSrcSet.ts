import { SlideImageComponentOptions } from "../SlideOptions";
import { SlideshowOptions } from "../SlideshowOptions";

export const assignSrcSet = (
  slideImage: SlideImageComponentOptions,
  getSrcSet?: SlideshowOptions["getSrcSet"],
  getBlurSrcSet?: SlideshowOptions["getBlurSrcSet"]
) => {
  if (getSrcSet && !slideImage.image.srcSet) {
    slideImage.image.srcSet = getSrcSet(slideImage.image);
  }

  if (slideImage.blurImage && !slideImage.blurImage?.srcSet && getBlurSrcSet) {
    slideImage.blurImage.srcSet = getBlurSrcSet(slideImage.blurImage);
  }
};

export const assignSizes = (
  slideImage: SlideImageComponentOptions,
  getSizes?: SlideshowOptions["getSizes"],
  getBlurSizes?: SlideshowOptions["getBlurSizes"]
) => {
  if (getSizes && !slideImage.image.sizes) {
    slideImage.image.sizes = getSizes(slideImage.image);
  }

  if (slideImage.blurImage && !slideImage.blurImage?.sizes && getBlurSizes) {
    slideImage.blurImage.sizes = getBlurSizes(slideImage.blurImage);
  }
};
