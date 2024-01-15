import { useEffect, useState } from "react";

const useEncoders = () => {
	const [encoders, setEncoders] = useState<object>({});
	useEffect(() => {
		fetch(`http://${window.location.hostname}:8000/api/encoders`)
			.then((response) => response.json())
			.then((data) => setEncoders(data))
			.catch((error) => console.error(error));
	}, []);
	return encoders;
};
export default useEncoders;
