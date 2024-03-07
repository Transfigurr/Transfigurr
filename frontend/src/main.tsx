import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WebSocketProvider } from "./contexts/webSocketContext.tsx";
import { ThemeProvider } from "./contexts/themeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<WebSocketProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</WebSocketProvider>
	</React.StrictMode>
);
