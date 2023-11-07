import styles from "./Profiles.module.scss";
import Profile from "../profile/Profile";
const Profiles = () => {
	const numberOfComponents = 5;
	const testProfiles = [];

	for (let i: number = 1; i < numberOfComponents; i++) {
		testProfiles.push(<Profile header="Any" />);
	}
	testProfiles.push(<Profile header="Any" type={"add"} />);

	return (
		<div className={styles.profiles}>
			<div className={styles.codecProfiles}>
				<div className={styles.header}>Codec Profiles</div>
				<div className={styles.profileContainer}>{testProfiles}</div>
			</div>
		</div>
	);
};
export default Profiles;
