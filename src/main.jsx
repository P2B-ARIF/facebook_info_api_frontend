import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Demo from "./Demo.jsx";
import Home from "./Home.jsx";
import "./index.css";
import NotFound from "./NotFound.jsx";
import { Toaster } from "react-hot-toast";

export const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/api", element: <Home /> },
	{ path: "/demo", element: <Demo /> },
	{ path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ChakraProvider>
			<RouterProvider router={router} />
			<Toaster />
		</ChakraProvider>
	</StrictMode>,
);
