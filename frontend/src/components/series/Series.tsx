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
import useMetadata from "../../hooks/useMetadata";

const Series = ({ series_name }: any) => {
	series_name = series_name.replace(/-/g, " ");
	const [modalType, setModalType] = useState("");
	const profiles: any = useProfilesAPI();

	const { series, setShouldSubscribe }: any = useSingleSeries(series_name);
	const metadata: any = useMetadata(series_name);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleEditClick = () => {
		setShouldSubscribe(false);
		setContent({
			monitored: series?.monitored,
			profile_id: series?.profile_id,
		});
		setModalType("edit");
		setIsModalOpen(true);
	};
	console.log(series);
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

	const status = metadata?.status;
	const network = metadata?.networks;
	const genre = metadata?.genre;
	const firstAirDate = metadata?.first_air_date?.split("-")[0].trim();
	const lastAirDate = metadata?.last_air_date?.split("-")[0].trim();
	const overview = metadata?.overview;
	const runYears =
		status === "Ended" ? firstAirDate + "-" + lastAirDate : firstAirDate + "-";
	const seasons: any = [];
	if (metadata) {
		for (let seasonNumber in metadata?.seasons) {
			seasons.unshift(<Season seasonData={metadata?.seasons[seasonNumber]} />);
		}
	} else {
		for (let seasonNumber in series?.seasons) {
			seasons.unshift(<Season seasonData={series?.seasons[seasonNumber]} />);
		}
	}

	const onSave = async () => {
		await fetch(`http://localhost:8000/api/series/${series.name}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(content),
		});
		setShouldSubscribe(true);
		setIsModalOpen(false);
	};
	const [content, setContent] = useState({
		monitored: series?.monitored,
		profile_id: series?.profile_id,
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
							header={"Edit - " + metadata?.name}
							type={"edit"}
							isOpen={isModalOpen}
							setIsOpen={setIsModalOpen}
							onSave={onSave}
							data={profiles}
							content={content}
							setContent={setContent}
							setShouldSubscribe={setShouldSubscribe}
						/>
					</div>
				</div>
			)}
			<div className={styles.header}>
				<img
					className={styles.backdrop}
					src={
						"http://localhost:8000/config/metadata/series/" +
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
							"http://localhost:8000/config/metadata/series/" +
							series_name +
							"/poster.jpg"
						}
						alt={"poster"}
					/>
					<div className={styles.details}>
						<div className={styles.titleRow}>{metadata?.name}</div>
						<div className={styles.seriesDetails}>
							<span className={styles.runtime}>
								{metadata?.episode_run_time} Minutes
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
			<div className={styles.seasonsContainer}>{seasons}</div>
		</div>
	);
};
export default Series;
