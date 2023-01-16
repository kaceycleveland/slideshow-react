import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./App";
import { DefaultSlideshow } from "./slideshows/default";
import { ScrollingSlideshow } from "./slideshows/scrolling";

import "./main.scss";
import { ScrollingVertical } from "./slideshows/scrolling-vertical";
import { ScrollingVerticalGridGallery } from "./slideshows/scrolling-vertical-grid-gallery";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DefaultSlideshow />} />
          <Route path="/scrolling" element={<ScrollingSlideshow />} />
          <Route path="/scrolling-vertical" element={<ScrollingVertical />} />
          <Route
            path="/scrolling-vertical-grid-gallery"
            element={<ScrollingVerticalGridGallery />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
