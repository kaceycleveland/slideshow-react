import { ImageMetadata } from "../useSlideshow";
import clsx from "clsx";
import { ComponentProps, forwardRef, useCallback, useState } from "react";
import { DATA_SRC_ATTR } from "../useSlideshow/Constants";

export const SlideshowImage = forwardRef<HTMLImageElement, ImageMetadata>(
  ({ blurImgProps, classes, imgProps, active, containerId, dataSrc }, ref) => {
    const isRequested = imgProps?.loading === "eager";
    const [showFullQuality, setShowFullQuality] = useState(false);
    const onLoad = useCallback(() => setShowFullQuality(true), []);
    return (
      <div
        className={clsx(classes?.container, {
          hide: !active,
          active,
          requested: isRequested,
        })}
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
          className={clsx(classes?.mainImg)}
          ref={ref}
          {...{ [DATA_SRC_ATTR]: dataSrc }}
          {...imgProps}
          // loading={active ? "eager" : loading ?? "lazy"}
          onLoad={onLoad}
        />
      </div>
    );
  }
);

export type SlideshowImageProps = ComponentProps<typeof SlideshowImage>;
