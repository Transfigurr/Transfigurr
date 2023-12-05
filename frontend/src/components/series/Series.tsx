import { useState } from "react";
import ToolBar from "../ToolBar/ToolBar";
import styles from "./Series.module.scss";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AppsIcon from "@mui/icons-material/Apps";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import SyncIcon from "@mui/icons-material/Sync";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import Modal from "../modal/Modal";
import Season from "../season/Season";
import useProfilesAPI from "../../hooks/useProfilesAPI";
import useSingleSeries from "../../hooks/useSingleSeries";
import useSeasons from "../../hooks/useSeason";
import useEpisodes from "../../hooks/useEpisodes";
const Series = ({ series_name }: any) => {
	series_name = series_name.replace(/-/g, " ");
	const [modalType, setModalType] = useState("");

	const profiles: any = useProfilesAPI();

	const series: any = useSingleSeries(series_name);
	console.log(series);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleEditClick = () => {
		setContent({
			monitored: series?.monitored,
			profile_id: series?.profile_id,
			id: series?.id,
		});
		setModalType("edit");
		setIsModalOpen(true);
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

	const middleToolBarItems: any = [
		<ToolBarItem text="Options" icon={<AppsIcon fontSize="large" />} />,
	];
	const rightToolBarItems: any = [
		<ToolBarItem text="View" icon={<VisibilityIcon fontSize="medium" />} />,
		<ToolBarItem text="Sort" icon={<SwitchLeftIcon fontSize="medium" />} />,
		<ToolBarItem text="Filter" icon={<FilterAltIcon fontSize="medium" />} />,
	];

	const status = series?.status;
	const network = series?.networks;
	const genre = series?.genre;
	const firstAirDate = series?.first_air_date?.split("-")[0].trim();
	const lastAirDate = series?.last_air_date?.split("-")[0].trim();
	const overview = series?.overview;
	const runYears =
		status === "Ended" ? firstAirDate + "-" + lastAirDate : firstAirDate + "-";

	const onSave = async () => {
		console.log(content);
		content.id = series.id;
		await fetch(`http://localhost:8000/api/series/${series.name}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(content),
		});
		setIsModalOpen(false);
	};
	const [content, setContent] = useState({
		monitored: series?.monitored,
		profile_id: series?.profile_id,
		id: series?.id,
	});
	return (
		<div className={styles.series}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			{/* Render different modals based on the type */}
			{isModalOpen && modalType === "edit" && (
				<div className={styles.modalBackdrop}>
					<div className={styles.modalContent}>
						<Modal
							header={"Edit - " + series?.name}
							type={"edit"}
							isOpen={isModalOpen}
							setIsOpen={setIsModalOpen}
							onSave={onSave}
							data={profiles}
							content={content}
							setContent={setContent}
						/>
					</div>
				</div>
			)}
			<div className={styles.header}>
				<img
					className={styles.backdrop}
					src={
						"http://localhost:8000/config/artwork/series/" +
						series_name +
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
							series_name +
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
							<div className={styles.tag}>{series?.name}</div>

							<div className={styles.tag}>Test GB</div>
							<div className={styles.tag}>
								{series?.profile_id in profiles
									? profiles[series?.profile_id].name
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
				{Object.values(series.seasons || {}).map((season: any) => {
					return <Season season={season} />;
				})}
			</div>
		</div>
	);
};
export default Series;
