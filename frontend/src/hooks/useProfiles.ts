import { useEffect, useState, useRef } from "react";

const useProfiles = () => {
	const [socket, setSocket] = useState<any>(null);
	const [profiles, setProfiles] = useState();

	useEffect(() => {
		// Create a new WebSocket connection when the component mounts
		const newSocket = new WebSocket("ws://localhost:8000/ws/profiles");

		// Event handler when the WebSocket connection is opened
		newSocket.onopen = () => {
			console.log("WebSocket connected");
		};

		// Event handler for received messages
		newSocket.onmessage = (event) => {
			if (newSocket.readyState === WebSocket.OPEN) {
				setProfiles(JSON.parse(event.data));
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
	return profiles;
};

export default useProfiles;
