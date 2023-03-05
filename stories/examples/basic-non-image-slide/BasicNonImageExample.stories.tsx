import "./BasicNonImageExample.scss";
import {
  ImageMetadata,
  SlideOptions,
  useSlideshow,
  SlideshowImage,
  SlideshowThumbnail,
  SlideshowComponentOptions,
} from "../../../src/main";
import { DefaultSlides } from "../../shared";
import {
  SLIDE_IMAGE_CONTAINER_TEST_ID,
  SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID,
} from "../../../src/TestConstants";
import { forwardRef } from "react";

const addedDivSlide: SlideOptions[] = [
  {
    component: <div className="test-component">TEST</div>,
    thumbnail: {
      imgProps: {
        src: "https://ik.imagekit.io/z2cba9cyv/1.jpg?tr=w-200,h-200",
      },
    },
  },
  ...DefaultSlides,
];

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.imgProps.src + ",bl-12";
};

const SlideshowComponent = forwardRef<
  HTMLDivElement,
  SlideshowComponentOptions
>(({ component, dataIdx }, ref) => {
  return (
    <div className="content-container">
      <div ref={ref} data-idx={dataIdx}>
        {component}
      </div>
    </div>
  );
});

export const BasicNonImageExample = () => {
  const { rootThumbnailContainerRef, rootSlidesContainerRef, slides } =
    useSlideshow(addedDivSlide, {
      getBlurSrc,
      getThumbnailBlurSrc: getBlurSrc,
      isScrolling: true,
    });

  return (
    <div className="basic-non-image-example-container">
      <div
        ref={rootSlidesContainerRef}
        className="scrolling-gallery-container"
        data-testid={SLIDE_IMAGE_CONTAINER_TEST_ID}
      >
        {/* <div className={clsx("loading-indicator", { loading: isLoading })}>
          Loading...
        </div> */}
        {slides.map((slide, idx) => {
          if ("component" in slide)
            return <SlideshowComponent key={idx} {...slide} />;
          return "main" in slide && <SlideshowImage key={idx} {...slide} />;
        })}
      </div>
      <div
        ref={rootThumbnailContainerRef}
        className="image-gallery-thumbnail-container"
        data-testid={SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID}
      >
        {slides.map((slide, idx) => {
          return <SlideshowThumbnail key={idx} {...slide} />;
        })}
      </div>
    </div>
  );
};

export default {
  title: "Examples",
  component: BasicNonImageExample,
};
