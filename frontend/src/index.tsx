import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ModalContextProvider from "./contexts/modalContextProvider";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<ModalContextProvider>
		<StrictMode>
			<App />
		</StrictMode>
	</ModalContextProvider>
);
