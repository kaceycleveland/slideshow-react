import type { ReactFramework } from "@storybook/react";
import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import { LEFT_KEY, RIGHT_KEY } from "../../../src/useSlideshow/Constants";
import { PlayFunction } from "@storybook/csf";

export const basicSlideshowTest: PlayFunction<ReactFramework, unknown> =
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slideThumbnails = canvas.getAllByTestId("slide-thumbnail");
    const slidesContainer = canvas.getByTestId("slide-image-container");
    await userEvent.click(slideThumbnails[1]);
    await expect(slideThumbnails[1].className).toContain("active");

    await userEvent.click(slidesContainer);
    await userEvent.keyboard(`[${LEFT_KEY}]`);
    await expect(slideThumbnails[0].className).toContain("active");
    await userEvent.keyboard(`[${RIGHT_KEY}]`);
    await expect(slideThumbnails[1].className).toContain("active");
  };
