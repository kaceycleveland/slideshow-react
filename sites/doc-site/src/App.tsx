import { Outlet, Link } from "react-router-dom";

export const MainLayout = () => {
  return (
    <>
      <div className="w-full h-10 bg-slate-700">Test</div>
      <div className="flex w-full">
        <div className="flex flex-col border-r-2 gap-2 p-4 basis-1/4 max-w-xs">
          <Link to="/">Default</Link>
          <Link to="/scrolling">Scrolling</Link>
          <Link to="/scrolling-vertical">Scrolling Vertical</Link>
          <Link to="/scrolling-vertical-grid-gallery">
            Scrolling Vertical Grid
          </Link>
        </div>
        <div className="p-4 flex-1">
          <div className="max-w-3xl m-auto flex flex-col items-center">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
