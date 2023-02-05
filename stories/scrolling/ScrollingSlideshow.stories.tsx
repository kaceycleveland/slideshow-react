import "./ScrollingSlideshow.scss";
import {
  ImageMetadata,
  SlideOptions,
  useSlideshow,
  SlideshowImage,
  SlideshowThumbnail,
} from "../../src/main";
import { DefaultSlides } from "../shared";
import { ComponentStoryObj } from "@storybook/react";
import { basicSlideshowTest } from "../shared/tests/BasicSlideshowTest";

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.src + ",bl-12";
};

const ScrollingSlideshowComponent = () => {
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
    <div className="scrolling-container">
      <div
        ref={rootSlidesContainerRef}
        className="scrolling-gallery-container"
        data-testid="slide-image-container"
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
  component: ScrollingSlideshowComponent,
};

export const ScrollingSlideshow: ComponentStoryObj<
  typeof ScrollingSlideshowComponent
> = {
  play: async (context) => {
    await basicSlideshowTest(context);
  },
};
