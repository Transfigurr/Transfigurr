import { Link } from "react-router-dom";
import styles from "./Settings.module.scss";
const Settings = ({ setSelectedItem }: any) => {
	return (
		<div className={styles.settings}>
			<div className={styles.setting}>
				<Link className={styles.header} to="/settings/profiles">
					Profiles
				</Link>
				<div className={styles.body}>
					Quality, Language, Delay and Release profiles
				</div>
			</div>
			<div className={styles.setting}>
				<Link to="/settings/general" className={styles.header}>
					General
				</Link>
				<div className={styles.body}>
					Port, SSL, username/password, proxy, analytics and updates
				</div>
			</div>
		</div>
	);
};
export default Settings;
