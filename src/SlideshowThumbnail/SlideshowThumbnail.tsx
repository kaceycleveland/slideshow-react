import { SlideOptions, ThumbnailMetadata } from "../useSlideshow";
import clsx from "clsx";
import { forwardRef, useCallback, useState } from "react";
import { DATA_IDX_ATTR } from "../useSlideshow/Constants";
import { SLIDE_THUMBNAIL_TEST_ID } from "../TestConstants";

export interface SlideshowThumbnailAddedProps extends ThumbnailMetadata {
  className?: string;
}

export const SlideshowThumbnail = forwardRef<HTMLImageElement, SlideOptions>(
  ({ thumbnail, active, dataIdx }, _) => {
    const [showFullQuality, setShowFullQuality] = useState(false);
    const onLoad = useCallback(() => setShowFullQuality(true), []);

    if (thumbnail) {
      const {
        className,
        containerId,
        imgProps,
        classes,
        blurImgProps,
        onThumbnailClick,
        loaded,
      } = thumbnail;

      const { src, srcSet, sizes, ref, ...restImgProps } = imgProps;

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
            {...restImgProps}
            {...{ [DATA_IDX_ATTR]: dataIdx }}
            src={loaded ? src : undefined}
            srcSet={loaded ? srcSet : undefined}
            sizes={loaded ? sizes : undefined}
            // src={dataSrc}
            // loading={active ? "eager" : loading ?? "lazy"}
            onLoad={onLoad}
          />
        </div>
      );
    }

    return null;
  }
);
