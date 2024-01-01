import { useContext } from "react";
import ToolBar from "../ToolBar/ToolBar";
import styles from "./Series.module.scss";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import SyncIcon from "@mui/icons-material/Sync";
import Season from "../season/Season";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { ModalContext } from "../../contexts/modalContext";

const Series = ({ series_name }: any) => {
	const modalContext = useContext(ModalContext);
	series_name = series_name.replace(/-/g, " ");
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const series = wsContext?.data?.series[series_name];

	const handleEditClick = () => {
		modalContext?.setModalType("editSeries");
		modalContext?.setModalData(series);
		modalContext?.setShowModal(true);
	};
	const leftToolBarItems: any = [
		<ToolBarItem text="Update" icon={<SyncIcon fontSize="large" />} />,
		<ToolBarItem text="RSS Sync" icon={<RssFeedIcon fontSize="medium" />} />,
		<ToolBarItem
			text="Edit"
			icon={<RssFeedIcon fontSize="medium" />}
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

			<div className={styles.header}>
				<img
					className={styles.backdrop}
					src={
						"http://localhost:8000/config/artwork/series/" +
						series?.id +
						"/backdrop.jpg"
					}
					alt="backdrop"
				/>
				<div className={styles.filter}></div>
				<div className={styles.content}>
					<img
						className={styles.poster}
						src={
							"http://localhost:8000/config/artwork/series/" +
							series?.id +
							"/poster.jpg"
						}
						alt={"poster"}
					/>
					<div className={styles.details}>
						<div className={styles.titleRow}>{series?.name}</div>
						<div className={styles.seriesDetails}>
							<span className={styles.runtime}>
								{series?.episode_run_time} Minutes
							</span>
							<span className={styles.genre}>{genre}</span>
							<span className={styles.runYears}>{runYears}</span>
						</div>
						<div className={styles.tags}>
							<div className={styles.tag}>{"/series/" + series?.name}</div>

							<div className={styles.tag}>
								{" "}
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
							<div className={styles.tag}>{status}</div>
							<div className={styles.tag}>{network}</div>
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
	);
};
export default Series;
