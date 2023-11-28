import { useEffect, useState } from "react";

const useSeries = () => {
	const [socket, setSocket] = useState(null);
	const [series, setSeries] = useState([]);
	useEffect(() => {
		// Create a new WebSocket connection when the component mounts
		const newSocket: any = new WebSocket("ws://localhost:8000/ws/series");

		// Event handler when the WebSocket connection is opened
		newSocket.onopen = () => {
			console.log("WebSocket connected");
		};

		// Event handler for received messages
		newSocket.onmessage = (event: any) => {
			if (newSocket.readyState === WebSocket.OPEN) {
				setSeries(JSON.parse(event.data));
			}
		};

		// Event handler when the WebSocket connection is closed
		newSocket.onclose = () => {
			console.log("WebSocket closed");
		};

		// Set the WebSocket instance in the component's state
		setSocket(newSocket);

		// Cleanup: Close the WebSocket connection when the component is unmounted
		return () => {
			newSocket.close();
		};
	}, []); // The empty dependency array ensures that this effect runs only once on mount

	// Expose the socket and queue state to the components using this hook
	return series;
};

export default useSeries;
