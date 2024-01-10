import { useEffect, useState } from "react";

const useProfilesAPI = () => {
	const [profiles, setProfiles] = useState<[]>([]);
	useEffect(() => {
		fetch("http://localhost:8000/api/profiles")
			.then((response) => response.json())
			.then((data) => setProfiles(data))
			.catch((error) => console.error(error));
	}, []);

	return profiles;
};
export default useProfilesAPI;
