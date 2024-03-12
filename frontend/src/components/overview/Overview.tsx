import { useEffect, useState } from "react";
import styles from "./Overview.module.scss";
import { Link } from "react-router-dom";
import MonitoredIcon from "../svgs/bookmark_filled.svg?react";
import UnmonitoredIcon from "../svgs/bookmark_unfilled.svg?react";
import NetworkIcon from "../svgs/tower.svg?react";
import ProfileIcon from "../svgs/person.svg?react";
import DriveIcon from "../svgs/hard_drive.svg?react";
import FolderIcon from "../svgs/folder.svg?react";
import SeasonIcon from "../svgs/circle.svg?react";
import { formatSize } from "../../utils/format";

const Overview = ({ series, settings, profiles }: any) => {
	const size = settings?.media_overview_posterSize;
	let posterWidth = "128px";
	let posterHeight = "260px";
	if (size === "small") {
		posterWidth = "115px";
		posterHeight = "234px";
	} else if (size === "medium") {
		posterWidth = "128px";
		posterHeight = "260px";
	} else if (size === "large") {
		posterWidth = "170px";
		posterHeight = "324px";
	}
	const [imgSrc, setImgSrc] = useState<string | null>("");

	useEffect(() => {
		const fetchImage = async () => {
			try {
				let cachedResponse = null;
				let cache = null;
				if ("caches" in window) {
					cache = await caches.open("image-cache");
					cachedResponse = await cache.match(
						`/api/poster/series/${series?.id}`
					);
				}

				if (cachedResponse) {
					const blob = await cachedResponse.blob();
					setImgSrc(URL.createObjectURL(blob));
				} else {
					const response = await fetch(`/api/poster/series/${series?.id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});

					if (response.status !== 200) {
						setImgSrc(null);
						return;
					}

					const clonedResponse = response.clone();
					const blob = await response.blob();
					setImgSrc(URL.createObjectURL(blob));
					if (cache) {
						cache.put(`/api/poster/series/${series?.id}`, clonedResponse);
					}
				}
			} catch (e) {
				console.log(e);
			}
		};

		fetchImage();
	}, [series?.id]);
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
	return (
		<div className={styles.overview}>
			<Link to={`/series/${series?.id}`} className={styles.link}>
				<div className={styles.posterContainer}>
					<img
						className={styles.poster}
						style={{ maxWidth: posterWidth, maxHeight: posterHeight }}
						src={imgSrc || "/poster.png"}
						alt="poster"
					/>
					<div className={styles.footer}>
						<div className={styles.progressBar}>
							<div
								className={styles.progress}
								style={{
									backgroundColor: backgroundColor(),
									width: progress,
									height:
										settings.media_overview_detailedProgressBar == "1"
											? "15px"
											: "5px",
								}}
							></div>
							{settings?.media_overview_detailedProgressBar == "1" && (
								<div className={styles.detailText}>
									{series?.episode_count - series?.missing_episodes}/
									{series?.episode_count}
								</div>
							)}
						</div>
					</div>
				</div>
			</Link>
			<div className={styles.infoContainer}>
				<div className={styles.title}>
					<Link to={`/series/${series?.id}`} className={styles.link}>
						{series?.title ? series?.title : series.id}
					</Link>
				</div>
				<div className={styles.seriesData}>
					<div className={styles.overview}>
						<Link to={`/series/${series?.id}`} className={styles.link}>
							{series?.overview}
						</Link>
					</div>
					<div className={styles.tags}>
						<ul>
							{settings?.media_overview_showMonitored == "1" && (
								<li className={styles.tag}>
									{series?.monitored ? (
										<MonitoredIcon className={styles.svg} />
									) : (
										<UnmonitoredIcon className={styles.svg} />
									)}
									{series?.monitored ? "Monitored" : "Unmonitored"}
								</li>
							)}
							{settings?.media_overview_showNetwork == "1" && (
								<li className={styles.tag}>
									<NetworkIcon className={styles.svg} />
									{series?.networks}
								</li>
							)}
							{settings?.media_overview_showProfile == "1" && (
								<li className={styles.tag}>
									<ProfileIcon className={styles.svg} />
									{profiles && series?.profile_id in profiles
										? profiles[series?.profile_id]?.name
										: ""}
								</li>
							)}
							{settings?.media_overview_showSeasonCount == "1" && (
								<li className={styles.tag}>
									<SeasonIcon className={styles.svg} />
									{series?.seasons_count} Seasons
								</li>
							)}
							{settings?.media_overview_showPath == "1" && (
								<li className={styles.tag}>
									<FolderIcon className={styles.svg} />
									/series/{series?.id}
								</li>
							)}
							{settings?.media_overview_showSizeOnDisk == "1" && (
								<li className={styles.tag}>
									<DriveIcon className={styles.svg} />
									{formatSize(series?.size)}
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Overview;
