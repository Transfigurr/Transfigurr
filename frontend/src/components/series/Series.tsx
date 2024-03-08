import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Series.module.scss";
import Drive from "../svgs/hard_drive.svg?react";
import Profile from "../svgs/person.svg?react";
import Monitored from "../svgs/bookmark_filled.svg?react";
import Unmonitored from "../svgs/bookmark_unfilled.svg?react";
import Continuing from "../svgs/play_arrow.svg?react";
import Ended from "../svgs/stop.svg?react";
import Network from "../svgs/tower.svg?react";
import Season from "../season/Season";
import { WebSocketContext } from "../../contexts/webSocketContext";
import SeriesModal from "../modals/seriesModal/SeriesModal";
import SeriesToolbar from "../toolbars/seriesToolbar/SeriesToolbar";
import { formatSize } from "../../utils/format";
import FolderIcon from "../svgs/folder.svg?react";
import { Tooltip } from "react-tooltip";

const Series = ({ series_name }: any) => {
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const series: any =
		wsContext?.data?.series && profiles
			? wsContext?.data?.series[series_name]
			: {};
	const system = wsContext?.data?.system;
	const [content, setContent] = useState<any>({});
	const handleEditClick = () => {
		setIsModalOpen(true);
		setContent(series);
	};
	const [selected, setSelected] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const status = series?.status;
	const network = series?.networks;
	const genre = series?.genre;
	const firstAirDate = series?.first_air_date?.split("-")[0].trim();
	const lastAirDate = series?.last_air_date?.split("-")[0].trim();
	const overview = series?.overview;
	const runYears =
		status === "Ended" ? firstAirDate + "-" + lastAirDate : firstAirDate + "-";
	const [backdropSrc, setBackdropSrc] = useState<string | null>("");
	const [posterSrc, setPosterSrc] = useState<string | null>("");
	const loaded = useRef(false);

	useEffect(() => {
		if (loaded.current == true) {
			return;
		}
		const fetchImage = async (
			path: string,
			setSrc: (src: string | null) => void
		) => {
			try {
				let cache = null;
				let cachedResponse = null;
				if ("caches" in window) {
					cache = await caches.open("image-cache");
					cachedResponse = await cache.match(
						`http://${window.location.hostname}:7889/api/${path}/series/${series?.id}`
					);
				}

				if (cachedResponse) {
					const blob = await cachedResponse.blob();
					setSrc(URL.createObjectURL(blob));
				} else {
					const response = await fetch(
						`http://${window.location.hostname}:7889/api/${path}/series/${series?.id}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`,
							},
						}
					);
					if (response.status !== 200) {
						setSrc(null);
						return;
					}
					const clonedResponse = response.clone();
					const blob = await response.blob();
					setSrc(URL.createObjectURL(blob));
					if (cache) {
						cache.put(
							`http://${window.location.hostname}:7889/api/${path}/series/${series?.id}`,
							clonedResponse
						);
					}
				}
			} catch (e) {
				console.log(e);
			}
		};

		if (series?.id && series?.id !== "") {
			fetchImage("backdrop", setBackdropSrc);
			fetchImage("poster", setPosterSrc);
			loaded.current = true;
		}
	}, [series?.id]);
	return (
		<div className={styles.series}>
			<SeriesToolbar
				series={series}
				system={system}
				selected={selected}
				setSelected={setSelected}
				handleEditClick={handleEditClick}
				series_name={series_name}
			/>
			<SeriesModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				content={content}
				setContent={setContent}
				profiles={profiles}
			/>
			<div className={styles.seriesContent}>
				<div className={styles.header}>
					<img
						className={styles.backdrop}
						src={backdropSrc || "/backdrop.jpg"}
						alt="backdrop"
					/>
					<div className={styles.filter} />
					<div className={styles.content}>
						<img
							className={styles.poster}
							src={posterSrc || "/poster.png"}
							alt="poster"
						/>
						<div className={styles.details}>
							<div className={styles.titleRow}>
								<div className={styles.headerIcon}>
									<Tooltip
										id="monitoredTooltip"
										place="top"
										content="Monitored"
										style={{
											fontSize: "12px",
											padding: "5px 10px",
										}}
									/>
									<Tooltip
										id="unmonitoredTooltip"
										place="top"
										content="Unmonitored"
										style={{ fontSize: "12px", padding: "5px 10px" }}
									/>
									{series?.monitored ? (
										<Monitored
											data-tooltip-id="monitoredTooltip"
											className={styles.monitoredSVG}
										/>
									) : (
										<Unmonitored
											data-tooltip-id="unmonitoredTooltip"
											className={styles.monitoredSVG}
										/>
									)}
								</div>

								{series?.name ? series?.name : series?.id}
							</div>
							<div className={styles.seriesDetails}>
								<span className={styles.runtime}>
									{series?.runtime ? series?.runtime : "-"} Minutes
								</span>
								{genre ? <span className={styles.genre}>{genre}</span> : <></>}
								{status ? (
									<span className={styles.runYears}>{runYears}</span>
								) : (
									<></>
								)}
							</div>
							<div className={styles.tags}>
								<div className={styles.tag}>
									<div className={styles.icon}>
										<FolderIcon className={styles.svg} />
									</div>
									{"/series/" + (series?.name ? series?.name : series?.id)}
								</div>

								<div className={styles.tag}>
									<div className={styles.icon}>
										<Drive className={styles.svg} />
									</div>
									{formatSize(series?.size)}
								</div>
								<div className={styles.tag}>
									<div className={styles.icon}>
										<Profile className={styles.svg} />
									</div>
									{profiles && series?.profile_id in profiles
										? profiles[series?.profile_id]?.name
										: ""}
								</div>
								<div className={styles.tag}>
									<div className={styles.icon}>
										<Tooltip
											id="monitoredTooltip2"
											place="top"
											content="Monitored"
										/>
										<Tooltip
											id="unmonitoredTooltip2"
											place="top"
											content="Unmonitored"
										/>
										{series?.monitored ? (
											<Monitored
												data-tooltip-id="monitoredTooltip2"
												className={styles.svg}
											/>
										) : (
											<Unmonitored
												data-tooltip-id="unmonitoredTooltip2"
												className={styles.svg}
											/>
										)}
									</div>
									{series?.monitored ? "Monitored" : "Unmonitored"}
								</div>
								{status ? (
									<div className={styles.tag}>
										<div className={styles.icon}>
											{status === "Ended" ? (
												<Ended className={styles.svg} />
											) : (
												<Continuing className={styles.svg} />
											)}
										</div>
										{status}
									</div>
								) : (
									<></>
								)}
								{network ? (
									<div className={styles.tag}>
										<div className={styles.icon}>
											<Network className={styles.svg} />
										</div>
										{network}
									</div>
								) : (
									<></>
								)}
							</div>
							<div className={styles.overview}>{overview}</div>
						</div>
					</div>
				</div>
				<div className={styles.seasonsContainer}>
					{Object.values(series?.seasons || {})
						.reverse()
						.map((season: any) => {
							return (
								<Season
									season={season}
									monitored={series?.monitored}
									key={season?.id}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
};
export default Series;
