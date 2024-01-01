import { createContext } from "react";

export type WebSocketContextType = {
	data: any | null;
	ws: WebSocket | null;
};

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);
