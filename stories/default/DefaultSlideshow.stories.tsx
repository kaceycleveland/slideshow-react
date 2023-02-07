import "./DefaultSlideshow.scss";
import {
  ImageMetadata,
  SlideOptions,
  useSlideshow,
  SlideshowImage,
  SlideshowThumbnail,
} from "../../src/main";
import { DefaultSlides } from "../shared";
import {
  basicSlideshowTest,
  SLIDE_IMAGE_CONTAINER_TEST_ID,
  SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID,
} from "../shared/tests/BasicSlideshowTest";
import { ComponentStoryObj } from "@storybook/react";

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
  component: DefaultSlideshowComponent,
  parameters: {
    // Sets a delay for the component's stories
    chromatic: { delay: 300 },
  },
};

export const DefaultSlideshow: ComponentStoryObj<
  typeof DefaultSlideshowComponent
> = {
  play: async (context) => {
    await basicSlideshowTest(context);
  },
};
