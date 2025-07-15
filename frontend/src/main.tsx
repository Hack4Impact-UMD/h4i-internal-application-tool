import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

const router = createBrowserRouter([{ path: '*', errorElement: <ErrorPage />, element: <App /> }]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
);
