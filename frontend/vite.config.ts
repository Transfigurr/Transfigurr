import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:7889",
				changeOrigin: true,
				ws: false,
			},
			"/ws": {
				target: "ws://localhost:7889",
				changeOrigin: true,
				ws: true,
			},
		},
	},
	plugins: [
		react(),
		svgr({
			svgrOptions: {
				icon: true,
			},
		}),
	],
});
