import { ImageMetadata } from "../useSlideshow";
import clsx from "clsx";
import { ComponentProps, forwardRef, useCallback, useState } from "react";
import { DATA_IDX_ATTR, DATA_SRC_ATTR } from "../useSlideshow/Constants";

export interface SlideshowImageAddedProps extends ImageMetadata {
  className?: string;
}

export const SlideshowImage = forwardRef<
  HTMLImageElement,
  SlideshowImageAddedProps
>(
  (
    {
      className,
      blurImgProps,
      classes,
      imgProps,
      active,
      containerId,
      src,
      dataIdx,
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
        id={containerId}
      >
        {blurImgProps?.src && (
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
          onFocus={() => console.log("FOCUSED2", containerId)}
          {...{ [DATA_SRC_ATTR]: src, [DATA_IDX_ATTR]: dataIdx }}
          {...imgProps}
          // loading={active ? "eager" : loading ?? "lazy"}
          onLoad={onLoad}
        />
      </div>
    );
  }
);

export type SlideshowImageProps = ComponentProps<typeof SlideshowImage>;
