import { ThumbnailMetadata } from "../SlideOptions";

export const assignThumbnailClick = (
  thumbnailMetadata: ThumbnailMetadata,
  index: number,
  setActiveThumbnailIdx: (idx: number) => void
) => {
  thumbnailMetadata.onThumbnailClick = () => setActiveThumbnailIdx(index);
};
