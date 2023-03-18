import { SlideImageComponentOptions } from "../SlideOptions";
import { SlideshowOptions } from "../SlideshowOptions";

export const assignSrcSet = (
  slideImage: SlideImageComponentOptions,
  getSrcSet?: SlideshowOptions["getSrcSet"]
) => {
  if (getSrcSet && !slideImage.image.srcSet) {
    slideImage.image.srcSet = getSrcSet(slideImage.image);
  }
};

export const assignSizes = (
  slideImage: SlideImageComponentOptions,
  getSizes?: SlideshowOptions["getSizes"]
) => {
  if (getSizes && !slideImage.image.sizes) {
    slideImage.image.sizes = getSizes(slideImage.image);
  }
};
