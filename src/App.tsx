import "./App.css";
import { ImageMetadata, SlideOptions, useSlideshow } from "./useSlideshow";
import { SlideshowImage } from "./SlideshowImage";
import { SlideshowThumbnail } from "./SlideshowThumbnail";
import { useSlideshowScroll } from "./useSlideshowScroll";

const slideOptions: SlideOptions[] = [
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/1.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/1.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/2.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/2.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/3.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/3.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/4.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/4.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/5.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/5.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-200,h-200",
    },
  },
  {
    main: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-800,h-800",
    },
    thumbnail: {
      dataSrc: "https://ik.imagekit.io/z2cba9cyv/6.jpg?tr=w-200,h-200",
    },
  },
];

const getId = (index: number) => `slide-${index}`;
const getThumbnailId = (index: number) => `thumb-${index}`;

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.dataSrc + ",bl-12";
};

function App() {
  const {
    rootThumbnailContainerRef,
    rootSlidesContainerRef,
    slides,
    active,
    index,
    setSlideIdx,
  } = useSlideshow(slideOptions, {
    getBlurSrc,
    getThumbnailBlurSrc: getBlurSrc,
    preloadDepth: 1,
  });

  const { containerRef } = useSlideshowScroll(index, getId, {
    passedContainerRef: rootSlidesContainerRef,
  });

  const { containerRef: thumbnailContainerRef } = useSlideshowScroll(
    index,
    getThumbnailId,
    {
      passedContainerRef: rootThumbnailContainerRef,
    }
  );

  console.log("slides", slides);

  return (
    <div className="App">
      <div onClick={() => setSlideIdx(index - 1)}>Previous</div>
      <div onClick={() => setSlideIdx(index + 1)}>Next</div>
      <div ref={containerRef} className="image-gallery-container">
        {/* <div className={clsx("loading-indicator", { loading: isLoading })}>
          Loading...
        </div> */}
        {slides.map((slide, idx) => (
          <SlideshowImage key={idx} containerId={getId(idx)} {...slide.main} />
        ))}
      </div>
      <div
        ref={thumbnailContainerRef}
        className="image-gallery-thumbnail-container"
      >
        {slides.map(
          (slide, idx) =>
            slide.thumbnail && (
              <SlideshowThumbnail
                key={idx}
                containerId={getThumbnailId(idx)}
                {...slide.thumbnail}
              />
            )
        )}
      </div>
    </div>
  );
}

export default App;
