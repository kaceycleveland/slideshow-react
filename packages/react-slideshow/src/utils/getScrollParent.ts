// https://gist.github.com/twxia/bb20843c495a49644be6ea3804c0d775
const REGEXP_SCROLL_PARENT = /^(visible|hidden)/;

export const getScrollParent: (el: HTMLElement | null) => HTMLElement | null = (
  el
) =>
  !(el instanceof HTMLElement) || typeof window.getComputedStyle !== "function"
    ? null
    : el.scrollHeight >= el.clientHeight &&
      !REGEXP_SCROLL_PARENT.test(
        window.getComputedStyle(el).overflowY ||
          window.getComputedStyle(el).overflowX ||
          "visible"
      )
    ? el
    : getScrollParent(el.parentElement) || document.body;
