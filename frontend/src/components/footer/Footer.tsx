import styles from "./Footer.module.scss";
const Footer = ({ data }: any) => {
	const series = "Series " + (data ? data.length : 0).toString();
	const ended = "Ended " + (data ? data.length : 0).toString();
	const continuing = "Continuing " + (data ? data.length : 0).toString();
	const monitored = "Monitored " + (data ? data.length : 0).toString();
	const unmonitored = "Unmonitored " + (data ? data.length : 0).toString();
	const episodes = "Episodes " + (data ? data.length : 0).toString();
	const movies = "Movies " + (data ? data.length : 0).toString();
	const files = "Files " + (data ? data.length : 0).toString();
	const totalFileSize =
		"Total File Size " + (data ? data.length : 0).toString();

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
				<div className={styles.data}>{series}</div>
				<div className={styles.data}>{ended}</div>
				<div className={styles.data}>{continuing}</div>
				<div className={styles.data}>{monitored}</div>
				<div className={styles.data}>{unmonitored}</div>
				<div className={styles.data}>{episodes}</div>
				<div className={styles.data}>{movies}</div>
				<div className={styles.data}>{files}</div>
				<div className={styles.data}>{totalFileSize}</div>
			</div>
		</div>
	);
};
export default Footer;
