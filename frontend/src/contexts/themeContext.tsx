import { useState, useEffect, useContext, useRef } from "react";
import { WebSocketContext } from "./webSocketContext";
import { createContext } from "react";
export const ThemeContext = createContext<any>(undefined);
export function ThemeProvider({ children }: any) {
	const wsContext: any = useContext(WebSocketContext);
	const [theme, setTheme] = useState(null);
	const themeRef = useRef(theme);
	useEffect(() => {
		const newTheme = wsContext?.data?.settings?.theme;
		if (themeRef.current !== newTheme) {
			setTheme(newTheme);
			themeRef.current = newTheme;
		}
	}, [wsContext]);

	return (
		<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
	);
}
