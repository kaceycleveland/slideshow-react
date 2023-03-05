import "./ScrollingSlideshow.scss";
import {
  ImageMetadata,
  useSlideshow,
  SlideshowImage,
  SlideshowThumbnail,
} from "../../../src/main";
import { DefaultSlides } from "../../shared";
import { ComponentStoryObj } from "@storybook/react";
import {
  SLIDE_IMAGE_CONTAINER_TEST_ID,
  SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID,
} from "../../../src/TestConstants";
import { basicSlideshowTest } from "../../shared/tests";

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.imgProps.src + ",bl-12";
};

const ScrollingSlideshowComponent = () => {
  const { rootThumbnailContainerRef, rootSlidesContainerRef, slides } =
    useSlideshow(DefaultSlides, {
      getBlurSrc,
      getThumbnailBlurSrc: getBlurSrc,
      isScrolling: true,
    });

  return (
    <div className="scrolling-container">
      <div
        ref={rootSlidesContainerRef}
        className="scrolling-gallery-container"
        data-testid={SLIDE_IMAGE_CONTAINER_TEST_ID}
      >
        {/* <div className={clsx("loading-indicator", { loading: isLoading })}>
          Loading...
        </div> */}
        {slides.map((slide, idx) => {
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
  title: "Interaction Tests/Basic",
  component: ScrollingSlideshowComponent,
};

export const ScrollingSlideshow: ComponentStoryObj<
  typeof ScrollingSlideshowComponent
> = {
  play: async (context) => {
    await basicSlideshowTest(context);
  },
};
