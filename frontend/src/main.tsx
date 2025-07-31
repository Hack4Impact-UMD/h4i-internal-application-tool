import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";

// TODO use this for prod, currently annoying for development
// const router = createBrowserRouter([{ path: '*', errorElement: <ErrorPage />, element: <App /> }]);

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <RouterProvider router={router}></RouterProvider>
//   </StrictMode>,
// );

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
