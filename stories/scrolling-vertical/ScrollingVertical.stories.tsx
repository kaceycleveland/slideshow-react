import "./ScrollingVertical.scss";
import {
  ImageMetadata,
  SlideOptions,
  useSlideshow,
  SlideshowImage,
  SlideshowThumbnail,
} from "../../src/main";
import { DefaultSlides } from "../shared";
import type { ComponentStoryObj } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import { LEFT_KEY, RIGHT_KEY } from "../../src/useSlideshow/Constants";
import {
  basicSlideshowTest,
  SLIDE_IMAGE_CONTAINER_TEST_ID,
  SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID,
} from "../shared/tests/BasicSlideshowTest";

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.src + ",bl-12";
};

const ScrollingVerticalComponent = () => {
  const {
    rootThumbnailContainerRef,
    rootSlidesContainerRef,
    slides,
    active,
    index,
    setSlideIdx,
    slideshowState,
  } = useSlideshow(DefaultSlides, {
    getBlurSrc,
    getThumbnailBlurSrc: getBlurSrc,
    isScrolling: true,
  });

  return (
    <div className="scrolling-vertical-container">
      <div
        ref={rootSlidesContainerRef}
        className="scrolling-gallery-container"
        data-testid={SLIDE_IMAGE_CONTAINER_TEST_ID}
      >
        {/* <div className={clsx("loading-indicator", { loading: isLoading })}>
          Loading...
        </div> */}
        {slides.map((slide, idx) => (
          <SlideshowImage key={idx} {...slide.main} />
        ))}
      </div>
      <div
        ref={rootThumbnailContainerRef}
        className="image-gallery-thumbnail-container"
        data-testid={SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID}
      >
        {slides.map(
          (slide, idx) =>
            slide.thumbnail && (
              <SlideshowThumbnail key={idx} {...slide.thumbnail} />
            )
        )}
      </div>
    </div>
  );
};

export default {
  title: "Slideshow",
  component: ScrollingVerticalComponent,
};

export const ScrollingVertical: ComponentStoryObj<
  typeof ScrollingVerticalComponent
> = {
  play: async (context) => {
    await basicSlideshowTest(context);
  },
  parameters: {
    chromatic: {
      delay: 300,
    },
  },
};
