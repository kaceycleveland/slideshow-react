import "./DefaultSlideshow.scss";
import {
  ImageMetadata,
  SlideOptions,
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
  return imageMetadata.src + ",bl-12";
};

const DefaultSlideshowComponent = () => {
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
  });

  return (
    <div className="default-container">
      <div
        ref={rootSlidesContainerRef}
        className="default-gallery-container"
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
          return (
            "thumbnail" in slide && <SlideshowThumbnail key={idx} {...slide} />
          );
        })}
      </div>
    </div>
  );
};

export default {
  title: "Interaction Tests/Basic",
  component: DefaultSlideshowComponent,
};

export const DefaultSlideshow: ComponentStoryObj<
  typeof DefaultSlideshowComponent
> = {
  play: async (context) => {
    await basicSlideshowTest(context);
  },
};
