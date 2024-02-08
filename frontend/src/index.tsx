import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/themeContext";
import { WebSocketProvider } from "./contexts/webSocketContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<StrictMode>
		<WebSocketProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</WebSocketProvider>
	</StrictMode>,
);
