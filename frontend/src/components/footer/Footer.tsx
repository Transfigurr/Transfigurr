import styles from "./Footer.module.scss";
const Footer = () => {
	return (
		<div className={styles.footer}>
			<div className={styles.keyContainer}>
				<div className={styles.key}>
					<div
						className={styles.bubble}
						style={{ backgroundColor: "#5d9cec" }}
					></div>
					<div>Continuing (All episodes downloaded)</div>
				</div>
				<div className={styles.key}>
					<div
						className={styles.bubble}
						style={{ backgroundColor: "#27c24c" }}
					></div>
					<div>Ended (All episodes downloaded)</div>
				</div>
				<div className={styles.key}>
					<div
						className={styles.bubble}
						style={{ backgroundColor: "#f05050" }}
					></div>
					<div>Missing Episodes (Series monitored)</div>
				</div>
				<div className={styles.key}>
					<div
						className={styles.bubble}
						style={{ backgroundColor: "#ffa500" }}
					></div>
					<div>Missing Episodes (Series not monitored)</div>
				</div>
			</div>
			<div className={styles.dataContainer}>
				<div className={styles.data}>Series 47</div>
				<div className={styles.data}>Ended 47</div>
				<div className={styles.data}>Continuing 47</div>
				<div className={styles.data}>Monitored 47</div>
				<div className={styles.data}>Unmonitored 47</div>{" "}
				<div className={styles.data}>Episodes 47</div>
				<div className={styles.data}>Files 47</div>
				<div className={styles.data}>Total File Size 47.2 TB</div>
			</div>
		</div>
	);
};
export default Footer;
