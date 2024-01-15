import { useEffect, useState } from "react";

const useSystem = () => {
	const [system, setSystem] = useState<object>({});
	useEffect(() => {
		fetch(`http://${window.location.hostname}:8000/api/system`)
			.then((response) => response.json())
			.then((data) => setSystem(data))
			.catch((error) => console.error(error));
	}, []);

	return system;
};
export default useSystem;
