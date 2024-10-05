import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Demo from "./Demo.jsx";

export const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/api", element: <Home /> },
	{path: "/demo", element: <Demo/>},
	{ path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ChakraProvider>
			<RouterProvider router={router} />
		</ChakraProvider>
	</StrictMode>,
);
