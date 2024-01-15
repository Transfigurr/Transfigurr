import React, { useState, useEffect, useRef } from "react";
import { WebSocketContext, WebSocketContextType } from "./webSocketContext";

interface WebSocketProviderProps {
	children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const [data, setData] = useState(null);
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(`ws://${window.location.hostname}:8000/ws`);
		ws.current.onmessage = (e) => {
			setData(JSON.parse(e.data));
		};

		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, []);

	const value: WebSocketContextType = {
		data,
		ws: ws.current,
	};
	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	);
};
