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

const Overview = ({ media, settings, profiles }: any) => {
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
	const type = media.episode_count != undefined ? "series" : "movies";

	useEffect(() => {
		const fetchImage = async () => {
			try {
				let cachedResponse = null;
				let cache = null;
				if ("caches" in window) {
					cache = await caches.open("image-cache");
					cachedResponse = await cache.match(
						`/api/poster/${type}/${media?.id}`
					);
				}

				if (cachedResponse) {
					const blob = await cachedResponse.blob();
					setImgSrc(URL.createObjectURL(blob));
				} else {
					const response = await fetch(`/api/poster/${type}/${media?.id}`, {
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
						cache.put(`/api/poster/series/${media?.id}`, clonedResponse);
					}
				}
			} catch (e) {
				console.log(e);
			}
		};

		fetchImage();
	}, [media?.id, type]);
	const progress = () => {
		if (media?.missing_episodes == undefined) {
			return media?.missing == true ? "0%" : "100%";
		}
		return media?.episode_count === 0
			? "100%"
			: ((media?.episode_count - media?.missing_episodes) /
					media?.episode_count || 0) *
					100 +
					"%";
	};
	const backgroundColor = () => {
		if (progress() === "100%") {
			if (media?.missing_episodes == undefined) {
				return "rgb(39, 194, 76)";
			}
			return media?.status === "Ended"
				? "rgb(39, 194, 76)"
				: "rgb(93, 156, 236)";
		} else {
			return media?.monitored ? "rgb(240, 80, 80)" : "rgb(255, 165, 0)";
		}
	};
	return (
		<div className={styles.overview}>
			<Link to={`${type}/${media?.id}`} className={styles.poster}>
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
									width: progress(),
									height:
										settings.media_overview_detailedProgressBar == "1"
											? "15px"
											: "5px",
								}}
							/>
							{settings?.media_poster_detailedProgressBar == "1" && (
								<div className={styles.detailText}>
									{media?.episode_count == undefined ? (
										<>{media?.missing ? "0/1" : "1/1"}</>
									) : (
										<>
											{media?.episode_count - media?.missing_episodes}/
											{media?.episode_count}
										</>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</Link>
			<div className={styles.infoContainer}>
				<div className={styles.title}>
					<Link to={`/${type}/${media?.id}`} className={styles.link}>
						{media?.name ? media?.name : media.id}
					</Link>
				</div>
				<div className={styles.seriesData}>
					<div className={styles.overview}>
						<Link to={`/${type}/${media?.id}`} className={styles.link}>
							{media?.overview}
						</Link>
					</div>
					<div className={styles.tags}>
						<ul>
							{settings?.media_overview_showMonitored == "1" && (
								<li className={styles.tag}>
									{media?.monitored ? (
										<MonitoredIcon className={styles.svg} />
									) : (
										<UnmonitoredIcon className={styles.svg} />
									)}
									{media?.monitored ? "Monitored" : "Unmonitored"}
								</li>
							)}
							{settings?.media_overview_showNetwork == "1" && (
								<li className={styles.tag}>
									<NetworkIcon className={styles.svg} />
									{media?.missing_episodes != undefined
										? media?.networks
										: media?.studio}
								</li>
							)}
							{settings?.media_overview_showProfile == "1" && (
								<li className={styles.tag}>
									<ProfileIcon className={styles.svg} />
									{profiles && media?.profile_id in profiles
										? profiles[media?.profile_id]?.name
										: ""}
								</li>
							)}
							{settings?.media_overview_showSeasonCount == "1" &&
								media?.seasons_count != undefined && (
									<li className={styles.tag}>
										<SeasonIcon className={styles.svg} />
										{media?.seasons_count} Season
										{media?.seasons_count != 1 && "s"}
									</li>
								)}
							{settings?.media_overview_showPath == "1" && (
								<li className={styles.tag}>
									<FolderIcon className={styles.svg} />/{type}/{media?.id}
								</li>
							)}
							{settings?.media_overview_showSizeOnDisk == "1" && (
								<li className={styles.tag}>
									<DriveIcon className={styles.svg} />
									{formatSize(media?.size)}
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
