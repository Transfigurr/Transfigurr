import { useEffect, useState } from "react";

const useCodecs = () => {
	const [codecs, setCodecs] = useState<[]>([]);

	useEffect(() => {
		fetch("http://localhost:8000/api/codecs")
			.then((response) => response.json())
			.then((data) => setCodecs(data))
			.catch((error) => console.error(error));
	}, []);

	return codecs;
};
export default useCodecs;
