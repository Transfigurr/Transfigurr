import { useEffect, useState } from "react";

const useSettings = () => {
	const [settings, setSettings] = useState<[]>([]);
	useEffect(() => {
		fetch("http://localhost:8000/api/settings")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.error(error));
	}, []);

	return settings;
};
export default useSettings;
