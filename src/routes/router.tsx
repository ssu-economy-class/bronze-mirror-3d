import HomePage from "@/pages/home/page";
import MainPage from "@/pages/main/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/main", element: <MainPage /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
