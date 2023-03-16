import "./DefaultSlideshow.scss";
import {
  ImageMetadata,
  SlideOptions,
  SlideshowOptions,
  useSlideshow,
} from "../main";
import { DefaultSlides } from "./DefaultSlides";
import { SLIDE_IMAGE_CONTAINER_TEST_ID } from "../TestConstants";

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.src + ",bl-12";
};

const SLIDES: SlideOptions[] = [
  ...DefaultSlides,
  { component: <div>Test</div> },
];

const slideOptions: SlideshowOptions = {
  onSlideScrollStart: (idx: number) => {
    console.log("scroll start", idx);
  },
  onSlideScrollEnd: (idx: number) => {
    console.log("scroll end", idx);
  },
};

export const DefaultSlideshow = () => {
  const {
    rootSlidesContainerRef,
    slides,
    setSlideIdx,
    index,
    goNextSlide,
    goPreviousSlide,
  } = useSlideshow(SLIDES, {
    getBlurSrc,
    getThumbnailBlurSrc: getBlurSrc,
    startingIndex: 1,
    ...slideOptions,
  });

  return (
    <div className="default-container">
      <button onClick={goPreviousSlide}>Prev</button>
      <button onClick={goNextSlide}>Next</button>
      <div
        ref={rootSlidesContainerRef}
        className="default-gallery-container"
        data-testid={SLIDE_IMAGE_CONTAINER_TEST_ID}
      >
        {slides.map((slide, idx) => {
          if ("component" in slide) {
            return (
              <div
                ref={slide.ref}
                data-idx={slide.dataIdx}
                className="component-container"
              >
                {slide.component}
              </div>
            );
          }
          return (
            "image" in slide && (
              <div
                ref={slide.ref}
                data-idx={slide.dataIdx}
                className="image-container"
              >
                {slide.blurImage && (
                  <img
                    className={"blur-image " + (slide.loaded ? "hide" : "")}
                    {...slide.blurImage}
                  />
                )}
                {slide.loaded && (
                  <img className={"main-image"} {...slide.image} />
                )}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};
