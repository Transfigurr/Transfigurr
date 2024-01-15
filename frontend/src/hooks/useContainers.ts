import { useEffect, useState } from "react";

const useContainers = () => {
	const [containers, setContainers] = useState<[]>([]);
	useEffect(() => {
		fetch(`http://${window.location.hostname}:8000/api/containers`)
			.then((response) => response.json())
			.then((data) => setContainers(data))
			.catch((error) => console.error(error));
	}, []);
	return containers;
};
export default useContainers;
