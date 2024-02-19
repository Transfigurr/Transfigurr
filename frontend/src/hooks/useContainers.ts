import { useEffect, useState } from "react";

const useContainers = () => {
	const [containers, setContainers] = useState<[]>([]);
	useEffect(() => {
		fetch(`http://${window.location.hostname}:7889/api/containers`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((response) => response.json())
			.then((data) => setContainers(data))
			.catch((error) => console.error(error));
	}, []);
	return containers;
};
export default useContainers;
