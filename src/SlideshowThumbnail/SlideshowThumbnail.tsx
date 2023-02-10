import { ThumbnailMetadata } from "../useSlideshow";
import clsx from "clsx";
import { ComponentProps, forwardRef, useCallback, useState } from "react";
import { DATA_SRC_ATTR } from "../useSlideshow/Constants";
import { SLIDE_THUMBNAIL_TEST_ID } from "../TestConstants";

export interface SlideshowThumbnailAddedProps extends ThumbnailMetadata {
  className?: string;
}

export const SlideshowThumbnail = forwardRef<
  HTMLImageElement,
  SlideshowThumbnailAddedProps
>(
  (
    {
      className,
      active,
      containerId,
      imgProps,
      classes,
      blurImgProps,
      onThumbnailClick,
      src,
    },
    ref
  ) => {
    const [showFullQuality, setShowFullQuality] = useState(false);
    const onLoad = useCallback(() => setShowFullQuality(true), []);

    return (
      <div
        className={clsx(className, classes?.container, {
          hide: !active,
          active,
        })}
        onClick={onThumbnailClick}
        data-testid={SLIDE_THUMBNAIL_TEST_ID}
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
          {...{ [DATA_SRC_ATTR]: src }}
          // src={dataSrc}
          // loading={active ? "eager" : loading ?? "lazy"}
          onLoad={onLoad}
        />
      </div>
    );
  }
);

export type SlideshowThumbnailProps = ComponentProps<typeof SlideshowThumbnail>;
