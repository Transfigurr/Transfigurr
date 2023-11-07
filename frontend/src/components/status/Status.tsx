import styles from "./Status.module.scss";
const Status = () => {
	return (
		<div className={styles.status}>
			<div className={styles.health}>
				<div className={styles.header}>Health</div>
			</div>
			<div className={styles.diskSpace}>
				<div className={styles.header}>Disk Space</div>
			</div>
			<div className={styles.about}>
				<div className={styles.header}>About</div>
			</div>
			<div className={styles.moreInfo}>
				<div className={styles.header}>More Info</div>
			</div>
		</div>
	);
};
export default Status;
