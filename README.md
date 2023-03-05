![Header Image](react-slideshow.png)

![npm version](https://4.vercel.app/npm/version/slideshow-react?)
![npm downloads](https://4.vercel.app/npm/downloadmonth/slideshow-react?)
[![codecov](https://codecov.io/gh/kaceycleveland/slideshow-react/branch/main/graph/badge.svg?token=RF3OOAW9HF)](https://codecov.io/gh/kaceycleveland/slideshow-react)

# Slideshow React

This library is still a heavy work in progress!

Create a slideshow with lazy loaded image (and other elements) using the IntersectionObserver API with support for thumbnails and scrolling. Styling/style sheets are not bundled with this library but examples of styling implementations can be seen in our storybook.

[Storybook Link](https://main--63dc6385f62009b5201ebeae.chromatic.com)

## Philosophy

There are a couple design decisions that impact the way the current iteration is implemented detailed below.

### Load Only What is Viewable
**Only what is viewable and is presumed to be viewed soon should be loaded/requested.**

#### Images

Images should typically be loaded into the DOM with a small file size footprint and then load the full quality one when needed. NextJS for example does this with their blur prop and providing two different srcs for an image and then loading the full quality image when it comes into the viewport. This library does the same using the intersection observer API. As a slideshow is scrolled, it will request and load the full quality one. In addition, a `preloadingDepth` can be provided to load the full quality images of neighboring slides as well at a given depth away from the current active slide.


#### Other Components

Providing callback functions for components such as `onSlideIn`, `onSlideOut`, and `onSlideInEnd` will eventually be supported.

### Offset most Logic to Browser Functionality
**Slideshow functionality can be built with native browser supported CSS and JavaScript.**

Between built-in JavaScript functions and CSS properties, building out a slideshow is doable with little else. Adding lazy loading of images and other convenient hooks and functions as part of the slideshow is where `slideshow-react` comes in. Under the covers, the examples `slideshow-react` uses are implemented mostly using CSS (technically SCSS) to show an agnostic way of implementing slideshow styling separate from any other styling methods (JSS, TailwindCSS, etc).

#### Images
The general practice when implementing CSS around images in a slideshow is:
- The dimensions should not change (use `srcset` and `sizes` attributes on images to load responsive versions)
- The rendered image should match the dimensions of the loaded image

Typical implementations will involve the usage of:
- CSS `object-fit` property
- `srcset` and `sizes` image attributes
