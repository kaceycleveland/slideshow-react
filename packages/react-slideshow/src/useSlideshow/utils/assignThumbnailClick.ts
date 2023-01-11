import { ImageMetadata, ThumbnailMetadata } from "../SlideOptions";

export const assignThumbnailClick = (
  thumbnailMetadata: ThumbnailMetadata,
  index: number,
  setActiveSlideIdx: (idx: number) => void
) => {
  thumbnailMetadata.onThumbnailClick = () => setActiveSlideIdx(index);
};
