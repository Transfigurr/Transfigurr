import { useContext } from "react";
import styles from "./Footer.module.scss";
import { WebSocketContext } from "../../contexts/webSocketContext";
const Footer = () => {
	const wsContext = useContext(WebSocketContext);
	const system = wsContext?.data?.system;
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
				<div className={styles.section}>
					<div className={styles.data}>Series {system?.series_count}</div>
					<div className={styles.data}>Ended {system?.ended_count}</div>
					<div className={styles.data}>
						Continuing {system?.continuing_count}
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.data}>Monitored {system?.monitored_count}</div>

					<div className={styles.data}>
						Unmonitored {system?.unmonitored_count}
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.data}>Episodes {system?.episode_count}</div>
					<div className={styles.data}>Files {system?.files_count}</div>
				</div>
				<div className={styles.section}>
					<div className={styles.data}>
						{"Size on Disk   "}
						{(system?.size_on_disk / 1000000000).toFixed(2)} GB
					</div>
					<div className={styles.data}>
						{"Space Saved   "}
						{(system?.space_saved / 1000000000).toFixed(2)} GB
					</div>
				</div>
			</div>
		</div>
	);
};
export default Footer;
