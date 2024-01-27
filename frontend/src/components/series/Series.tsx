import { useContext } from "react";
import ToolBar from "../ToolBar/ToolBar";
import styles from "./Series.module.scss";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { ReactComponent as RssFeedIcon } from "../svgs/rss_feed.svg";
import { ReactComponent as SyncIcon } from "../svgs/sync.svg";
import Season from "../season/Season";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { ModalContext } from "../../contexts/modalContext";

const Series = ({ series_name }: any) => {
	const modalContext = useContext(ModalContext);
	series_name = series_name.replace(/-/g, " ");
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const series: any =
		wsContext?.data?.series && profiles
			? wsContext?.data?.series[series_name]
			: {};
	const handleEditClick = () => {
		modalContext?.setModalType("editSeries");
		modalContext?.setModalData(series);
		modalContext?.setShowModal(true);
	};

	const handleScanClick = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/scan/series/${series_name}`,
			{
				method: "PUT",
			},
		);
	};

	const handleMetadataClick = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/scan/series/metadata${series_name}`,
			{
				method: "PUT",
			},
		);
	};

	const leftToolBarItems: any = [
		<ToolBarItem text="Scan" icon={<SyncIcon />} onClick={handleScanClick} />,
		<ToolBarItem
			text="Metadata"
			icon={<RssFeedIcon />}
			onClick={handleMetadataClick}
		/>,
		<ToolBarItem
			text="Edit"
			icon={<RssFeedIcon />}
			onClick={handleEditClick}
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
	return (
		<div className={styles.series}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			<div className={styles.test}>
				<div className={styles.header}>
					<img
						className={styles.backdrop}
						src={
							`http://${window.location.hostname}:7889/api/backdrop/series/` +
							series?.id
						}
						alt="backdrop"
					/>
					<div className={styles.filter}></div>
					<div className={styles.content}>
						<img
							className={styles.poster}
							src={
								`http://${window.location.hostname}:7889/api/poster/series/` +
								series?.id
							}
							alt={"poster"}
						/>
						<div className={styles.details}>
							<div className={styles.titleRow}>
								{series?.name ? series?.name : series?.id}
							</div>
							<div className={styles.seriesDetails}>
								<span className={styles.runtime}>
									{series?.episode_run_time ? series?.episode_run_time : "-"}{" "}
									Minutes
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
									{"/series/" + (series?.name ? series?.name : series?.id)}
								</div>

								<div className={styles.tag}>
									{((series?.size || 0) / 1000000000).toFixed(2).toString() +
										" GB"}
								</div>
								<div className={styles.tag}>
									{profiles && series?.profile_id in profiles
										? profiles[series?.profile_id]?.name
										: ""}
								</div>
								<div className={styles.tag}>
									{series?.monitored ? "Monitored" : "Unmonitored"}
								</div>
								{status ? <div className={styles.tag}>{status}</div> : <></>}
								{network ? <div className={styles.tag}>{network}</div> : <></>}
							</div>
							<div className={styles.overview}>{overview}</div>
						</div>
					</div>
				</div>
				<div className={styles.seasonsContainer}>
					{Object.values(series?.seasons || {})
						.reverse()
						.map((season: any) => {
							return <Season season={season} />;
						})}
				</div>
			</div>
		</div>
	);
};
export default Series;
