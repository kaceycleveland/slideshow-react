import "./ScrollingSlideshow.scss";
import {
  ImageMetadata,
  SlideOptions,
  useSlideshow,
  SlideshowImage,
  SlideshowThumbnail,
} from "react-slideshow";

const slideOptions: SlideOptions[] = [
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/1.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/1.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/2.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/2.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/3.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/3.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/4.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/4.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/5.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/5.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      src: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-600,h-600",
    },
    thumbnail: {
      src: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-200,h-200",
    },
  },
];

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.src + ",bl-12";
};

export const ScrollingSlideshow = () => {
  const {
    rootThumbnailContainerRef,
    rootSlidesContainerRef,
    slides,
    active,
    index,
    setSlideIdx,
    slideshowState,
  } = useSlideshow(slideOptions, {
    getBlurSrc,
    getThumbnailBlurSrc: getBlurSrc,
    isScrolling: true,
  });

  return (
    <div className="scrolling-container">
      <div ref={rootSlidesContainerRef} className="scrolling-gallery-container">
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
