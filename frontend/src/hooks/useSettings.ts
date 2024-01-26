import { useEffect, useState } from "react";

const useSettingsAPI = () => {
	const [settings, setSettings] = useState<object>({});
	useEffect(() => {
		fetch(`http://${window.location.hostname}:7889/api/settings`)
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.error(error));
	}, []);
	return settings;
};
export default useSettingsAPI;
