import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./App";
import { DefaultSlideshow } from "./slideshows/default";
import { ScrollingSlideshow } from "./slideshows/scrolling";

import "./main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DefaultSlideshow />} />
          <Route path="/scrolling" element={<ScrollingSlideshow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
