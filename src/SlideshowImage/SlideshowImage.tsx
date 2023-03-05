import { SlideImageComponentOptions } from "../useSlideshow";
import clsx from "clsx";
import { forwardRef, useCallback, useState } from "react";
import { DATA_IDX_ATTR } from "../useSlideshow/Constants";
import { SLIDE_TEST_ID } from "../TestConstants";

export const SlideshowImage = forwardRef<
  HTMLImageElement,
  SlideImageComponentOptions
>(
  (
    {
      active,
      dataIdx,
      loaded,
      main: { className, blurImgProps, classes, imgProps, containerId },
    },
    mainRef
  ) => {
    const { src, srcSet, sizes, ...restImgProps } = imgProps;
    const [showFullQuality, setShowFullQuality] = useState(false);
    const onLoad = useCallback(() => setShowFullQuality(true), []);
    return (
      <div
        className={clsx(className, classes?.container, {
          hide: !active,
          active,
        })}
        id={containerId}
        data-testid={SLIDE_TEST_ID}
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
          ref={mainRef}
          {...{ [DATA_IDX_ATTR]: dataIdx }}
          src={loaded ? src : undefined}
          srcSet={loaded ? srcSet : undefined}
          sizes={loaded ? sizes : undefined}
          {...restImgProps}
          // loading={active ? "eager" : loading ?? "lazy"}
          onLoad={onLoad}
        />
      </div>
    );
  }
);
