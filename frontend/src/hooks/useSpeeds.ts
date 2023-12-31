import { useEffect, useState } from "react";

const useSpeeds = () => {
	const [speeds, setSpeeds] = useState<[]>([]);

	useEffect(() => {
		fetch("http://localhost:8000/api/codecs/speeds")
			.then((response) => response.json())
			.then((data) => setSpeeds(data))
			.catch((error) => console.error(error));
	}, []);

	return speeds;
};
export default useSpeeds;
