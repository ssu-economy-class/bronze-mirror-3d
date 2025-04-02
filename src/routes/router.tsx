import MainPage from "@/pages/main/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{ path: "/", element: <MainPage /> }]);

export default function Router() {
  return <RouterProvider router={router} />;
}
