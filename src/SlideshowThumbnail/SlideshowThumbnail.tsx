import {
  ImageMetadata,
  SlideOptions,
  ThumbnailMetadata,
} from "../useSlideshow";
import clsx from "clsx";
import { ComponentProps, forwardRef, useCallback, useState } from "react";
import { DATA_SRC_ATTR } from "../useSlideshow/Constants";

export const SlideshowThumbnail = forwardRef<
  HTMLImageElement,
  ThumbnailMetadata
>(
  (
    {
      active,
      containerId,
      imgProps,
      classes,
      blurImgProps,
      onThumbnailClick,
      dataSrc,
    },
    ref
  ) => {
    const [showFullQuality, setShowFullQuality] = useState(false);
    const onLoad = useCallback(() => setShowFullQuality(true), []);

    return (
      <div
        className={clsx(classes?.container, {
          hide: !active,
          active,
        })}
        onClick={onThumbnailClick}
        id={containerId}
      >
        {blurImgProps && (
          <img
            className={clsx(blurImgProps?.className, classes?.blurImg, {
              hide: showFullQuality,
            })}
            {...blurImgProps}
            loading={"eager"}
          />
        )}
        <img
          ref={ref}
          className={clsx(classes?.mainImg)}
          {...imgProps}
          {...{ [DATA_SRC_ATTR]: dataSrc }}
          // src={dataSrc}
          // loading={active ? "eager" : loading ?? "lazy"}
          onLoad={onLoad}
        />
      </div>
    );
  }
);

export type SlideshowThumbnailProps = ComponentProps<typeof SlideshowThumbnail>;
