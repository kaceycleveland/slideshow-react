export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // Notifies Chromatic to pause the animations when they finish at a global level.
  chromatic: { pauseAnimationAtEnd: true },
};
