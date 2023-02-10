import type { ReactFramework } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent, waitFor } from "@storybook/testing-library";
import { LEFT_KEY, RIGHT_KEY } from "../../../src/useSlideshow/Constants";
import { PlayFunction } from "@storybook/csf";
import waitForScrollEnd from "./waitForScrollEnd";
import {
  SLIDE_TEST_ID,
  SLIDE_IMAGE_CONTAINER_TEST_ID,
} from "../../../src/TestConstants";

export const basicNoThumbnailTest: PlayFunction<ReactFramework, unknown> =
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slides = canvas.getAllByTestId(SLIDE_TEST_ID);
    const slidesContainer = canvas.getByTestId(SLIDE_IMAGE_CONTAINER_TEST_ID);

    await waitFor(() => {
      expect(slidesContainer.tabIndex).toEqual(0);
    });
    slidesContainer.focus();
    expect(slidesContainer).toHaveFocus();
    await userEvent.keyboard(`[${RIGHT_KEY}]`);
    await waitForScrollEnd(slidesContainer);
    await expect(slides[1].className).toContain("active");
    await userEvent.keyboard(`[${LEFT_KEY}]`);
    await waitForScrollEnd(slidesContainer);
    await expect(slides[0].className).toContain("active");
    await userEvent.keyboard(`[${LEFT_KEY}]`);
    await waitForScrollEnd(slidesContainer);
    await expect(slides[slides.length - 1].className).toContain("active");
    await userEvent.keyboard(`[${RIGHT_KEY}]`);
    await waitForScrollEnd(slidesContainer);
    await expect(slides[0].className).toContain("active");
  };
