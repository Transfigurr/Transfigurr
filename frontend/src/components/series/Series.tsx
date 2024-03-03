import { useContext, useEffect, useRef, useState } from "react";
import ToolBar from "../ToolBar/ToolBar";
import styles from "./Series.module.scss";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { ReactComponent as RssFeedIcon } from "../svgs/rss_feed.svg";
import { ReactComponent as SyncIcon } from "../svgs/cached.svg";
import { ReactComponent as Folder } from "../svgs/folder.svg";
import { ReactComponent as Drive } from "../svgs/hard_drive.svg";
import { ReactComponent as Profile } from "../svgs/person.svg";
import { ReactComponent as Monitored } from "../svgs/bookmark_filled.svg";
import { ReactComponent as Unmonitored } from "../svgs/bookmark_unfilled.svg";
import { ReactComponent as Continuing } from "../svgs/play_arrow.svg";
import { ReactComponent as Ended } from "../svgs/stop.svg";
import { ReactComponent as Network } from "../svgs/tower.svg";
import { ReactComponent as EditIcon } from "../svgs/edit.svg";
import { ReactComponent as LoadingIcon } from "../svgs/loading.svg";
import Season from "../season/Season";
import { WebSocketContext } from "../../contexts/webSocketContext";
import SeriesModals from "../seriesModals/SeriesModals";

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
	const handleScanClick = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/scan/series/${series_name}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		);
	};

	const handleMetadataClick = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/scan/series/metadata/${series_name}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		);
	};

	const leftToolBarItems: any = [
		<ToolBarItem
			text="Scan"
			key="scan"
			icon={
				<SyncIcon
					className={
						system?.scan_running && system?.scan_target == series?.id
							? styles.spinning
							: ""
					}
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			onClick={handleScanClick}
			selected={selected}
			setSelected={setSelected}
		/>,
		<ToolBarItem
			text="Refresh Metadata"
			key="metadata"
			icon={
				system?.metadata_running == "1" &&
				system?.metadata_target == series?.id ? (
					<LoadingIcon
						className={styles.loading}
						style={{
							fill: "white",
							color: "white",
							height: "30px",
							width: "30px",
						}}
					/>
				) : (
					<RssFeedIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				)
			}
			onClick={handleMetadataClick}
			selected={selected}
			setSelected={setSelected}
		/>,
		<ToolBarItem
			text="Edit"
			key="edit"
			icon={<EditIcon />}
			onClick={handleEditClick}
			selected={selected}
			setSelected={setSelected}
		/>,
	];

	const middleToolBarItems: any = [];
	const rightToolBarItems: any = [];
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
			setSrc: (src: string | null) => void,
		) => {
			try {
				let cache = null;
				let cachedResponse = null;
				if ("caches" in window) {
					cache = await caches.open("image-cache");
					cachedResponse = await cache.match(
						`http://${window.location.hostname}:7889/api/${path}/series/${series?.id}`,
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
						},
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
							clonedResponse,
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
			{isModalOpen ? (
				<div className={styles.modalBackdrop}>
					<div className={styles.modalContent}>
						<SeriesModals
							setIsModalOpen={setIsModalOpen}
							content={content}
							setContent={setContent}
						/>
					</div>
				</div>
			) : (
				<></>
			)}
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
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
									{series?.monitored ? (
										<Monitored style={{ height: "55px", width: "55px" }} />
									) : (
										<Unmonitored style={{ height: "55px", width: "55px" }} />
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
										<Folder />
									</div>
									{"/series/" + (series?.name ? series?.name : series?.id)}
								</div>

								<div className={styles.tag}>
									<div className={styles.icon}>
										<Drive />
									</div>
									{((series?.size || 0) / 1000000000).toFixed(2).toString() +
										" GB"}
								</div>
								<div className={styles.tag}>
									<div className={styles.icon}>
										<Profile />
									</div>
									{profiles && series?.profile_id in profiles
										? profiles[series?.profile_id]?.name
										: ""}
								</div>
								<div className={styles.tag}>
									<div className={styles.icon}>
										{series?.monitored ? <Monitored /> : <Unmonitored />}
									</div>
									{series?.monitored ? "Monitored" : "Unmonitored"}
								</div>
								{status ? (
									<div className={styles.tag}>
										<div className={styles.icon}>
											{status === "Ended" ? <Ended /> : <Continuing />}
										</div>
										{status}
									</div>
								) : (
									<></>
								)}
								{network ? (
									<div className={styles.tag}>
										<div className={styles.icon}>
											<Network />
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
