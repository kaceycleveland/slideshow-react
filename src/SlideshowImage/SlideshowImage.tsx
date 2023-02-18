import { SlideImageComponentOptions } from "../useSlideshow";
import clsx from "clsx";
import { forwardRef, useCallback, useState } from "react";
import { DATA_IDX_ATTR, DATA_SRC_ATTR } from "../useSlideshow/Constants";
import { SLIDE_TEST_ID } from "../TestConstants";

export const SlideshowImage = forwardRef<
  HTMLImageElement,
  SlideImageComponentOptions
>(
  (
    {
      active,
      dataIdx,
      main: {
        className,
        blurImgProps,
        classes,
        imgProps,
        containerId,
        src,
        ref,
      },
    },
    mainRef
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
