import { useEffect, useState } from "react";

const useSeriesAPI = () => {
	const [series, setSeries] = useState<[]>([]);
	useEffect(() => {
		fetch(`http://${window.location.hostname}:8000/api/series`)
			.then((response) => response.json())
			.then((data) => setSeries(data))
			.catch((error) => console.error(error));
	}, []);
	return series;
};
export default useSeriesAPI;
