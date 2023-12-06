import { useEffect, useMemo, useState } from "react";

const useProfilesAPI = () => {
	const [profiles, setProfiles] = useState<{}>({});
	useEffect(() => {
		fetch("http://localhost:8000/api/profiles")
			.then((response) => response.json())
			.then((data) => setProfiles(data))
			.catch((error) => console.error(error));
	}, []);
	const memoizedProfiles = useMemo(() => profiles, [profiles]);

	return memoizedProfiles;
};
export default useProfilesAPI;
