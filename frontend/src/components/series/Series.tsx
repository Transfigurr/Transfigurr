import { useEffect, useState } from "react";
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
import useProfiles from "../../hooks/useProfiles";

const Series = ({ seriesName }: any) => {
	const [modalType, setModalType] = useState("");
	const profiles = useProfiles();
	const handleEditClick = () => {
		setContent({ monitored: false, profile: profile?.id });
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

	const [series, setSeries] = useState([]);
	useEffect(() => {
		fetch("http://localhost:8000/api/data/series")
			.then((response) => response.json())
			.then((data) => setSeries(data))
			.catch((error) => console.error(error));
	}, []);

	seriesName = seriesName.replace(/-/g, " ");

	const seriesData: any = series.filter(
		(obj: any) => obj.name === seriesName
	)[0];

	const status = seriesData?.status;
	const network = seriesData?.networks;
	const genre = seriesData?.genre;
	const firstAirDate = seriesData?.first_air_date?.split("-")[0].trim();
	const lastAirDate = seriesData?.last_air_date?.split("-")[0].trim();
	const overview = seriesData?.overview;
	const runYears =
		status === "Ended" ? firstAirDate + "-" + lastAirDate : firstAirDate + "-";

	const [isModalOpen, setIsModalOpen] = useState(false);
	const seasons: any = [];
	for (let seasonNumber in seriesData?.seasons) {
		seasons.unshift(<Season seasonData={seriesData?.seasons[seasonNumber]} />);
	}

	const onSave = async () => {
		seriesData.profile = content.profile;
		for (const seasonNumber in seriesData["seasons"]) {
			seriesData["seasons"][seasonNumber].profile = content.profile;
			for (const episodeNumber in seriesData["seasons"][seasonNumber][
				"episodes"
			]) {
				seriesData["seasons"][seasonNumber]["episodes"][episodeNumber].profile =
					content.profile;
			}
		}
		await fetch(`http://localhost:8000/api/series/${seriesData.name}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ series_data: seriesData }),
		});
	};
	const profile: any = profiles ? profiles[seriesData?.profile] : {};
	const [content, setContent] = useState({
		monitored: false,
		profile: profile?.id,
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
							header={"Edit - " + seriesData.name}
							type={"edit"}
							isOpen={isModalOpen}
							setIsOpen={setIsModalOpen}
							onSave={onSave}
							data={seriesData}
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
						"http://localhost:8000/config/metadata/series/" +
						seriesName +
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
							seriesName +
							"/poster.jpg"
						}
						alt={"poster"}
					/>
					<div className={styles.details}>
						<div className={styles.titleRow}>{seriesData?.name}</div>
						<div className={styles.seriesDetails}>
							<span className={styles.runtime}>
								{seriesData?.episode_run_time} Minutes
							</span>
							<span className={styles.genre}>{genre}</span>
							<span className={styles.runYears}>{runYears}</span>
						</div>
						<div className={styles.tags}>
							<div className={styles.tag}>{seriesData?.series_path}</div>

							<div className={styles.tag}>Test GB</div>
							<div className={styles.tag}>{profile?.name}</div>
							<div className={styles.tag}>{"mono"}</div>
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
