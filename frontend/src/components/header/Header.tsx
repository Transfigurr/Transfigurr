import useQueue from "../../hooks/useQueue";
import styles from "./Header.module.scss";
import PersonIcon from "@mui/icons-material/Person";
const HeaderComponent = () => {
	const queue: any = useQueue();
	return (
		<div className={styles.header}>
			<div className={styles.left}>
				<div className={styles.logo}>
					<img
						className={styles.svg}
						src={process.env.PUBLIC_URL + "/Logo/Sonarr.svg"}
						alt="logo"
					/>
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.queue}>
					<span> Progress: {parseInt(queue?.progress)}%</span>
					<span>
						ETA: {Math.floor(parseInt(queue.eta || 0) / 60)}:
						{parseInt(queue.eta || 0) % 60}
					</span>
					<span>Active?: {queue?.active ? "True" : "False"}</span>
					<span>Stage: {queue?.stage}</span>
				</div>
				<div className={styles.profile}>
					<PersonIcon />
				</div>
			</div>
		</div>
	);
};
export default HeaderComponent;
