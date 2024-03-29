# slideshow-react

## 0.1.4

### Patch Changes

- a1ed06d: Added additional type narrowing to the `slides` object being passed and returned from `useSlideshow`
- 7c41d89: Update README to match current implementation and added MUI codesandbox example link
- a1ed06d: Version bumped MUI example

## 0.1.3

### Patch Changes

- e8e222a: Simplify some typings and correct loading logic via a `isSetToLoad` `SlideOptions` field
- e8e222a: Update MUI example to 0.1.2
- e8e222a: Added additional `srcSet` and `sizes` support via generating functions

## 0.1.2

### Patch Changes

- e4ffdcd: Added MUI example
- a42cb15: Added support for generating and assigning srcSet and sizes props for image slides

## 0.1.1

### Patch Changes

- 08be3b3: Fix package.json to point towards correct production files

## 0.1.0

### Minor Changes

- 622dda3: Simplified useSlideshow to not have any thumbnail relation and implemented new options for `onSlideScrollStart` and `onSlideScrollEnd`

## 0.0.8

### Patch Changes

- 1f02b35: Added typedoc for documentation and the support for deploying via GH actions
- 3abb282: Initial work to support srcset and responsive image components better
- bd8f408: Deprecate using data-src attribute and instead use react setState and passed props

## 0.0.7

### Patch Changes

- 4872ea1: Added inline TypeScript documentation for most current options

## 0.0.6

### Patch Changes

- 453c157: Added additional information in the README

## 0.0.5

### Patch Changes

- e7b630c: Change README encoding

## 0.0.4

### Patch Changes

- 45354c9: Renamed to slideshow-react

## 0.0.3

### Patch Changes

- 9e883a2: Remove svg in bundle and remove source map if its prod

## 0.0.2

### Patch Changes

- 1efcae3: Moved react and react-dom to peerDependecies and devDependencies
