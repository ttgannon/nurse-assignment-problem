import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoggedInAssignment } from "./components/LoggedInAssignment/LoggedInAssignment.tsx";
import { DemoPatientAssignment } from "./components/DemoComponents/DemoPatientAssignment.tsx";

export const Context = createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/assignment",
    element: <LoggedInAssignment />,
  },
  {
    path: "/demo",
    element: <DemoPatientAssignment />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
