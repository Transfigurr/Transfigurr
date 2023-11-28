import { useEffect, useState } from "react";

const useSingleSeries = (series_name: any) => {
	const [socket, setSocket] = useState(null);
	const [series, setSeries] = useState({});
	const [shouldSubscribe, setShouldSubscribe] = useState(true); // Flag to control subscription

	useEffect(() => {
		// Create a new WebSocket connection when the component mounts
		const newSocket: any = new WebSocket(
			"ws://localhost:8000/ws/series/single/" + series_name
		);

		// Event handler when the WebSocket connection is opened
		newSocket.onopen = () => {
			console.log("WebSocket connected");
		};

		// Event handler for received messages
		newSocket.onmessage = (event: any) => {
			if (newSocket.readyState === WebSocket.OPEN && shouldSubscribe) {
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
	}, [series_name, shouldSubscribe]); // Include series_name and shouldSubscribe in the dependency array
	// Expose the socket and queue state to the components using this hook
	return { series, setShouldSubscribe };
};

export default useSingleSeries;
