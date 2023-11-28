import { useEffect, useState } from "react";
import styles from "./Poster.module.scss";
import useSingleSeries from "../../hooks/useSingleSeries";
const PosterComponent = ({ name }: any) => {
	const status = "Monitored";
	const profile = "AV1";
	const progress = "80%";
	const series = useSingleSeries(name);
	return (
		<div className={styles.cardArea}>
			<div className={styles.card}>
				<div className={styles.cardContent}>
					{
						//<div className={styles.ended}xp></div>
					}
					{}

					<img
						className={styles.img}
						src={
							"http://localhost:8000/config/metadata/series/" +
							name +
							"/poster.jpg"
						}
						alt={name}
					></img>
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
