import './DefaultSlideshow.scss';
import {
  ImageMetadata,
  SlideOptions,
  SlideshowOptions,
  useSlideshow,
} from '../main';
import { DefaultSlides } from './DefaultSlides';
import { SLIDE_IMAGE_CONTAINER_TEST_ID } from '../TestConstants';

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.src + ',bl-12';
};

const getBlurSrcSet = (imageMetadata: ImageMetadata) => {
  if (imageMetadata.src) {
    const src = imageMetadata.src.substring(0, imageMetadata.src.length - 21);
    return `${src}?tr=w-300,h-300,bl-12 300w, ${src}?tr=w-400,h-400,bl-12 400w, ${src}?tr=w-600,h-600,bl-12 600w`;
  }
};

const getSrcSet = (imageMetadata: ImageMetadata) => {
  if (imageMetadata.src) {
    const src = imageMetadata.src.substring(0, imageMetadata.src.length - 15);
    return `${src}?tr=w-300,h-300 300w, ${src}?tr=w-400,h-400 400w, ${src}?tr=w-600,h-600 600w`;
  }
};

const getSizes = (imageMetadata: ImageMetadata) => {
  return `(max-width: 800px) 300px, (max-width: 1200px) 400px, 600px`;
};

const slideOptions: SlideshowOptions = {
  onSlideScrollStart: (idx: number) => {
    console.log('scroll start', idx);
  },
  onSlideScrollEnd: (idx: number) => {
    console.log('scroll end', idx);
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
  } = useSlideshow(DefaultSlides, {
    getBlurSrc,
    getSrcSet,
    getSizes,
    getBlurSrcSet,
    getBlurSizes: getSizes,
    getThumbnailBlurSrc: getBlurSrc,
    startingIndex: 1,
    ...slideOptions,
  });

  console.log('active', index);

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
          if ('component' in slide) {
            return (
              <div
                key={idx}
                ref={slide.ref}
                data-idx={slide.dataIdx}
                className="component-container"
              >
                {slide.component}
              </div>
            );
          }
          return (
            'image' in slide && (
              <div
                key={idx}
                ref={slide.ref}
                data-idx={slide.dataIdx}
                className="image-container"
              >
                {slide.blurImage && (
                  <img
                    className={'blur-image ' + (slide.loaded ? 'hide' : '')}
                    {...slide.blurImage}
                  />
                )}
                {slide.isSetToLoad && (
                  <img className={'main-image'} {...slide.image} />
                )}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};
