import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DemoPatientAssignment } from "./components/DemoPatientAssignment.tsx";
import { LoggedInAssignment } from "./components/LoggedInAssignment.tsx";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
