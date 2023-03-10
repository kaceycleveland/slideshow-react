import "./ScrollingNoThumbnails.scss";
import { ImageMetadata, useSlideshow, SlideshowImage } from "../../../src/main";
import { DefaultSlides } from "../../shared";
import { ComponentStoryObj } from "@storybook/react";
import { SLIDE_IMAGE_CONTAINER_TEST_ID } from "../../../src/TestConstants";
import { basicNoThumbnailTest } from "../../shared/tests";

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.imgProps.src + ",bl-12";
};

const ScrollingNoThumbnailsComponent = () => {
  const { rootSlidesContainerRef, slides } = useSlideshow(DefaultSlides, {
    getBlurSrc,
    getThumbnailBlurSrc: getBlurSrc,
    isScrolling: true,
  });

  return (
    <div className="scrolling-no-thumbnail-container">
      <div
        ref={rootSlidesContainerRef}
        className="scrolling-gallery-container"
        data-testid={SLIDE_IMAGE_CONTAINER_TEST_ID}
      >
        {slides.map((slide, idx) => {
          return "main" in slide && <SlideshowImage key={idx} {...slide} />;
        })}
      </div>
    </div>
  );
};

export default {
  title: "Interaction Tests/Basic",
  component: ScrollingNoThumbnailsComponent,
};

export const ScrollingNoThumbnails: ComponentStoryObj<
  typeof ScrollingNoThumbnailsComponent
> = {
  play: async (context) => {
    await basicNoThumbnailTest(context);
  },
};
