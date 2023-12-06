import { useEffect, useState } from "react";

const useMetadata = (name: string) => {
	const [metadata, setMetadata] = useState<{}>({});
	useEffect(() => {
		fetch(`http://localhost:8000/api/metadata/${name}`)
			.then((response) => response.json())
			.then((data) => setMetadata(data))
			.catch((error) => console.error(error));
	}, [name]);

	return metadata;
};
export default useMetadata;
