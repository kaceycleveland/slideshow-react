import { DATA_SRC_ATTR } from "../Constants";

export const loadImage = (image: HTMLImageElement) => {
  const foundAttr = image.getAttribute(DATA_SRC_ATTR);
  if (foundAttr && !image.getAttribute("src")) {
    image.setAttribute("src", foundAttr);
  }
};
