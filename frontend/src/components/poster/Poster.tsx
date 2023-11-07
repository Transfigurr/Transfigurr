import styles from "./Poster.module.scss";
const PosterComponent = ({ id }: any) => {
	const status = "Monitored";
	const profile = "AV1";
	const progress = "80%";

	return (
		<div className={styles.cardArea}>
			<div className={styles.card}>
				<div className={styles.cardContent}>
					{
						//<div className={styles.ended}></div>
					}
					<img className={styles.img} src={"missing.png"} alt="test"></img>
					<div className={styles.footer}>
						<div className={styles.progressBar}>
							<div
								className={styles.progress}
								style={{ width: progress }}
							></div>
						</div>
						<div className={styles.status}>{status}</div>
						<div className={styles.profile}>{profile}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PosterComponent;
