import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Header from "../components/Header";
import "../index.css";
import { Bounce, ToastContainer } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const darkTheme = useTheme();
  return (
    <>
      <Header />
      <hr />
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkTheme ? "dark" : "light"}
        transition={Bounce}
      />
      <TanStackRouterDevtools />
    </>
  );
}
