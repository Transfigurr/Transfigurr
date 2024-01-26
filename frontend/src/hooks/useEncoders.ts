import { useEffect, useState } from "react";

const useEncoders = () => {
	const [encoders, setEncoders] = useState<object>({});
	useEffect(() => {
		fetch(`http://${window.location.hostname}:7889/api/encoders`)
			.then((response) => response.json())
			.then((data) => setEncoders(data))
			.catch((error) => console.error(error));
	}, []);
	return encoders;
};
export default useEncoders;
