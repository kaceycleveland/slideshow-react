import { useState } from "react";
import { useSlideshow, SlideshowOptions, ImageMetadata } from "slideshow-react";
import { DefaultSlides } from "./DefaultSlides";
import { Box, Button } from "@mui/material";

const getBlurSrc = (imageMetadata: ImageMetadata) => {
  return imageMetadata.src + ",bl-12";
};

const slideOptions: SlideshowOptions = {
  onSlideScrollStart: (idx: number) => {
    console.log("scroll start", idx);
  },
  onSlideScrollEnd: (idx: number) => {
    console.log("scroll end", idx);
  },
};

export const MuiSlideshow = () => {
  const {
    rootSlidesContainerRef,
    slides,
    setSlideIdx,
    index,
    goNextSlide,
    goPreviousSlide,
  } = useSlideshow(DefaultSlides, {
    getBlurSrc,
    getThumbnailBlurSrc: getBlurSrc,
    startingIndex: 1,
    ...slideOptions,
  });

  return (
    <Box className="default-container">
      <Button onClick={goPreviousSlide}>Prev</Button>
      <Button onClick={goNextSlide}>Next</Button>
      <Box
        ref={rootSlidesContainerRef}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          height: { xs: "300px", md: "600px" },
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
        }}
      >
        {slides.map((slide, idx) => {
          return (
            <Box
              key={idx}
              ref={slide.ref}
              data-idx={slide.dataIdx}
              sx={{
                scrollSnapAlign: "center",
                scrollSnapStop: "always",
                position: "relative",
                maxWidth: "600px",
                flexBasis: "100%",
                flexGrow: 0,
                flexShrink: 0,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {"image" in slide ? (
                <>
                  {slide.blurImage && (
                    <Box
                      component="img"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        opacity: slide.loaded ? 0 : 1,
                        transition: "opacity 0.2s linear",
                      }}
                      {...slide.blurImage}
                    />
                  )}
                  {slide.loaded && (
                    <Box
                      component="img"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      {...slide.image}
                    />
                  )}
                </>
              ) : (
                slide.component
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MuiSlideshow;
