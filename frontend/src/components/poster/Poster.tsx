import styles from "./Poster.module.scss";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { Link } from "react-router-dom";
const PosterComponent = ({ name, posterWidth, posterHeight }: any) => {
	const wsContext = useContext(WebSocketContext);
	const series = wsContext?.data?.series[name];
	const profiles = wsContext?.data?.profiles;
	const settings = wsContext?.data?.settings;
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

	const [imgSrc, setImgSrc] = useState<string>("");

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const cache = await caches.open("image-cache");
				const cachedResponse = await cache.match(
					`http://${window.location.hostname}:7889/api/poster/series/${series?.id}`,
				);

				if (cachedResponse) {
					const blob = await cachedResponse.blob();
					setImgSrc(URL.createObjectURL(blob));
				} else {
					const response = await fetch(
						`http://${window.location.hostname}:7889/api/poster/series/${series?.id}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`,
							},
						},
					);
					const clonedResponse = response.clone();
					const blob = await response.blob();
					setImgSrc(URL.createObjectURL(blob));

					cache.put(
						`http://${window.location.hostname}:7889/api/poster/series/${series?.id}`,
						clonedResponse,
					);
				}
			} catch (e) {
				console.log(e);
			}
		};

		fetchImage();
	}, [series?.id]);
	console.log(settings);
	return (
		<div
			className={styles.cardArea}
			style={{ maxWidth: posterWidth, maxHeight: posterHeight }}
		>
			<Link to={`series/${name}`} className={styles.poster}>
				<div className={styles.card}>
					<div className={styles.cardContent}>
						<img
							className={styles.img}
							src={imgSrc || "/poster.png"}
							alt={name}
							style={{ maxWidth: posterWidth, maxHeight: posterHeight }}
						/>

						<div className={styles.footer}>
							<div className={styles.progressBar}>
								<div
									className={styles.progress}
									style={{
										backgroundColor: backgroundColor(),
										width: progress,
										height:
											settings.media_poster_detailedProgressBar == "1"
												? "15px"
												: "5px",
									}}
								></div>

								{settings?.media_poster_detailedProgressBar == "1" && (
									<div className={styles.detailText}>
										{series?.episode_count - series?.missing_episodes}/
										{series?.episode_count}
									</div>
								)}
							</div>
							{settings?.media_poster_showTitle == "1" && (
								<div className={styles.name}>
									{series?.name ? series?.name : series?.id}
								</div>
							)}
							{settings?.media_poster_showMonitored == "1" && (
								<div className={styles.status}>
									{series?.monitored ? "Monitored" : "Unmonitored"}
								</div>
							)}
							{settings?.media_poster_showProfile == "1" && (
								<div className={styles.profile}>
									{profiles && series?.profile_id in profiles
										? profiles[series?.profile_id]?.name
										: ""}
								</div>
							)}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};
export default PosterComponent;
