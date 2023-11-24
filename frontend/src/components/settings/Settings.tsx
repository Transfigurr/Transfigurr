import styles from "./Settings.module.scss";
const Settings = ({ setSelectedItem }: any) => {
	return (
		<div className={styles.settings}>
			<div className={styles.setting}>
				<div
					className={styles.header}
					onClick={() => (window.location.href = "/settings/media-management")}
				>
					Media Management
				</div>
				<div className={styles.body}>
					Naming, file management settings and root folders
				</div>
			</div>
			<div className={styles.setting}>
				<div
					className={styles.header}
					onClick={() => (window.location.href = "/settings/profiles")}
				>
					Profiles
				</div>
				<div className={styles.body}>
					Quality, Language, Delay and Release profiles
				</div>
			</div>
			<div className={styles.setting}>
				<div
					className={styles.header}
					onClick={() => (window.location.href = "/settings/general")}
				>
					General
				</div>
				<div className={styles.body}>
					Port, SSL, username/password, proxy, analytics and updates
				</div>
			</div>
		</div>
	);
};
export default Settings;
