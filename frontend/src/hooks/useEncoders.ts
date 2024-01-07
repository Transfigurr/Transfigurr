import { useEffect, useState } from "react";

const useEncoders = () => {
	const [encoders, setEncoders] = useState<{}>({});
	useEffect(() => {
		fetch("http://localhost:8000/api/encoders")
			.then((response) => response.json())
			.then((data) => setEncoders(data))
			.catch((error) => console.error(error));
	}, []);
	return encoders;
};
export default useEncoders;
