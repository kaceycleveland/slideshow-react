import { ImageMetadata, SlideOptions } from "../SlideOptions";
import { SlideshowClasses } from "../SlideshowClasses";

export const assignDefaultClasses = (
  imageMetadata: ImageMetadata,
  defaultClasses?: SlideshowClasses
) => {
  if (!imageMetadata.classes) imageMetadata.classes = {};
  if (defaultClasses) {
    if (!imageMetadata.classes?.mainImg && defaultClasses.mainImg)
      imageMetadata.classes.mainImg = defaultClasses.mainImg;

    if (!imageMetadata.classes?.blurImg && defaultClasses.blurImg)
      imageMetadata.classes.blurImg = defaultClasses.blurImg;

    if (!imageMetadata.classes?.container && defaultClasses.container)
      imageMetadata.classes.container = defaultClasses.container;
  }
};
