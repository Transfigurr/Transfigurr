import { useEffect, useState } from "react";

const useProfilesAPI = () => {
	const [profiles, setProfiles] = useState<[]>([]);
	useEffect(() => {
		fetch(`http://${window.location.hostname}:7889/api/profiles`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((response) => response.json())
			.then((data) => setProfiles(data))
			.catch((error) => console.error(error));
	}, []);

	return profiles;
};
export default useProfilesAPI;
