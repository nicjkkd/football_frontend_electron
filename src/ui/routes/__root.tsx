import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
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
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkTheme ? "bg-gradient-linear-dark" : "bg-gradient-linear"
      }`}
    >
      <Header />
      <div
        className={`h-px ${
          darkTheme
            ? "bg-gradient-to-r from-transparent via-linear-700/50 to-transparent"
            : "bg-gradient-to-r from-transparent via-linear-300 to-transparent"
        }`}
      />
      <main>
        <Outlet />
      </main>
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
      {/* <TanStackRouterDevtools /> */}
    </div>
  );
}
