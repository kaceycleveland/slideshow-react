// import "./ScrollingVertical.scss";
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

export const ScrollingVertical = () => {
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
    defaultClasses: {
      container: "snap-center relative inline-block w-full max-w-2xl",
      blurImg:
        "relative z-10 w-full h-full transition-opacity opacity-100 [&.hide]:opacity-0",
      mainImg: "absolute inset-0 w-full h-full",
    },
    defaultThumbnailClasses: {
      container:
        "snap-start relative w-full transition-opacity [&.hide]:opacity-20",
      blurImg:
        "relative z-10 w-full h-full transition-opacity opacity-100 [&.hide]:opacity-0",
      mainImg: "absolute inset-0 w-full h-full",
    },
  });

  return (
    <div className="flex w-full max-h-[42rem]">
      <div
        ref={rootSlidesContainerRef}
        className="relative whitespace-nowrap w-full max-w-2xl h-auto max-h-2xl overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
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
        className="relative flex flex-col whitespace-pre-wrap overflow-x-hidden overflow-y-auto snap-y snap-mandatory"
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
