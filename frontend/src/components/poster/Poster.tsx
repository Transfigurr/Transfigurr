import styles from "./Poster.module.scss";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
const PosterComponent = ({ name }: any) => {
	const wsContext = useContext(WebSocketContext);
	const series = wsContext?.data?.series[name];
	const profiles = wsContext?.data?.profiles;
	const progress =
		((series?.episode_count - series?.missing_episodes) /
			series?.episode_count || 0) *
			100 +
		"%";
	const backgroundColor = () => {
		if (progress === "100%") {
			return series?.status === "Ended"
				? "rgb(39, 194, 76)"
				: "rgb(93, 156, 236)";
		} else {
			return series?.monitored ? "rgb(240, 80, 80)" : "rgb(255, 165, 0)";
		}
	};

	const [imgSrc, setImgSrc] = useState<string | null>(null);

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const response = await fetch(
					`http://${window.location.hostname}:7889/api/poster/series/${series?.id}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					},
				);
				const blob = await response.blob();
				setImgSrc(URL.createObjectURL(blob));
			} catch (e) {
				console.log(e);
			}
		};

		fetchImage();
	}, [series?.id]);

	return (
		<div className={styles.cardArea}>
			<div className={styles.card}>
				<div className={styles.cardContent}>
					{series?.status === "Ended" ? (
						<div className={styles.ended}></div>
					) : (
						<></>
					)}
					{}

					<img className={styles.img} src={imgSrc || ""} alt={name}></img>
					<div className={styles.footer}>
						<div className={styles.progressBar}>
							<div
								className={styles.progress}
								style={
									progress === "100%"
										? { backgroundColor: backgroundColor(), width: progress }
										: { backgroundColor: backgroundColor(), width: progress }
								}
							></div>
						</div>
						<div className={styles.name}>
							{series?.name ? series?.name : series?.id}
						</div>
						<div className={styles.status}>
							{series?.monitored ? "Monitored" : "Unmonitored"}
						</div>
						<div className={styles.profile}>
							{profiles && series?.profile_id in profiles
								? profiles[series?.profile_id]?.name
								: ""}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PosterComponent;
