import { useEffect, useState } from "react";

const useSpeeds = () => {
	const [speeds, setSpeeds] = useState<[]>([]);

	useEffect(() => {
		fetch(`http://${window.location.hostname}:7889/api/codecs/speeds`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((response) => response.json())
			.then((data) => setSpeeds(data))
			.catch((error) => console.error(error));
	}, []);

	return speeds;
};
export default useSpeeds;
