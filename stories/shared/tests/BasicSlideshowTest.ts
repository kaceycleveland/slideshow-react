import type { ReactFramework } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import { LEFT_KEY, RIGHT_KEY } from "../../../src/useSlideshow/Constants";
import { PlayFunction } from "@storybook/csf";

export const SLIDE_TEST_ID = "slide-thumbnail";
export const SLIDE_IMAGE_CONTAINER_TEST_ID = "slide-image-container";
export const SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID =
  "slide-thumbnail-image-container";

export const basicSlideshowTest: PlayFunction<ReactFramework, unknown> =
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slideThumbnails = canvas.getAllByTestId(SLIDE_TEST_ID);
    const slidesContainer = canvas.getByTestId(SLIDE_IMAGE_CONTAINER_TEST_ID);
    const slidesThumbnailContainer = canvas.getByTestId(
      SLIDE_THUMBNAIL_IMAGE_CONTAINER_TEST_ID
    );
    await expect(slideThumbnails[0]).toHaveClass("active");
    await userEvent.click(slideThumbnails[1]);
    await expect(slideThumbnails[1].className).toContain("active");

    await userEvent.click(slidesContainer);
    await expect(slidesContainer).toHaveFocus();
    await userEvent.keyboard(`[${RIGHT_KEY}]`);
    await expect(slideThumbnails[2].className).toContain("active");
    await userEvent.keyboard(`[${LEFT_KEY}]`);
    await expect(slideThumbnails[1].className).toContain("active");
    await userEvent.click(slidesThumbnailContainer);
    await userEvent.keyboard(`[${LEFT_KEY}]`);
    await expect(slideThumbnails[0].className).toContain("active");
  };
