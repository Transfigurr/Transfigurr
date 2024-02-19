import { useEffect, useState } from "react";

const useMetadata = (name: string) => {
	const [metadata, setMetadata] = useState<object>({});
	useEffect(() => {
		fetch(`http://${window.location.hostname}:7889/api/metadata/${name}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((response) => response.json())
			.then((data) => setMetadata(data))
			.catch((error) => console.error(error));
	}, [name]);

	return metadata;
};
export default useMetadata;
