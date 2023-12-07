import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { Home, Contact } from "./components";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoggedInAssignment } from "./components/LoggedInAssignment/LoggedInAssignment.tsx";
import { DemoPatientAssignment } from "./components/DemoComponents/DemoPatientAssignment.tsx";
import { NotFound } from "./components/NotFound.tsx";
import { Background } from "./components/Background.tsx";
import App from "./App.tsx";

export const Context = createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/assignment",
    element: <LoggedInAssignment />,
  },
  {
    path: "/demo",
    element: <DemoPatientAssignment />,
  },
  { path: "/contact", element: <Contact /> },
  { path: "/background", element: <Background /> },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
);
