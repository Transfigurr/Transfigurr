import styles from "./Media.module.scss";
import Footer from "../footer/Footer";
import { useContext, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import Table from "../table/Table";
import MediaModel from "../mediaModal/MediaModal";
import Posters from "../posters/Posters";
import Overviews from "../overviews/Overviews";
import MediaToolbar from "../mediaToolbar/MediaToolbar";

const ExplorerComponent = () => {
	const wsContext = useContext(WebSocketContext);
	const series: any = wsContext?.data?.series;
	const settings = wsContext?.data?.settings;
	const profiles = wsContext?.data?.profiles;
	const view = settings?.media_view;
	const sort = settings?.media_sort;
	const filter = settings?.media_filter;
	let filteredSeries: any[] = Object.values(series || {});
	if (filter == "monitored") {
		filteredSeries = filteredSeries.filter((series: any) => series.monitored);
	} else if (filter == "unmonitored") {
		filteredSeries = filteredSeries.filter((series: any) => !series.monitored);
	} else if (filter == "continuing") {
		filteredSeries = filteredSeries.filter(
			(series: any) => series.status != "Ended",
		);
	} else if (filter == "ended") {
		filteredSeries = filteredSeries.filter(
			(series: any) => series.status == "Ended",
		);
	} else if (filter == "missing") {
		filteredSeries = filteredSeries.filter(
			(series: any) => series.missing_episodes != 0,
		);
	}

	let sortedSeries: any[] = filteredSeries;
	const sortSeries = (seriesArray: any[], column: string) => {
		return seriesArray.sort((a: any, b: any) => {
			if (typeof a[column] === "string" && typeof b[column] === "string") {
				return a[column].localeCompare(b[column]);
			} else if (
				typeof a[column] === "number" &&
				typeof b[column] === "number"
			) {
				return a[column] - b[column];
			} else {
				return 0;
			}
		});
	};
	if (sort == "title") {
		sortedSeries = sortSeries(sortedSeries, "id");
	} else if (sort == "monitored/status") {
		sortedSeries = sortSeries(sortedSeries, "monitored");
	} else if (sort == "network") {
		sortedSeries = sortSeries(sortedSeries, "networks");
	} else if (sort == "profile") {
		sortedSeries = sortedSeries.map((series: any) => {
			const profile = profiles[series.profile_id];
			return {
				...series,
				profile_id: profile?.name,
			};
		});
		sortedSeries = sortSeries(sortedSeries, "profile_id");
	} else if (sort == "episodes") {
		sortedSeries = sortSeries(sortedSeries, "episode_count");
	} else if (sort == "size") {
		sortedSeries = sortSeries(sortedSeries, "size");
	}
	const onUpdate = async () => {
		await fetch(`http://${window.location.hostname}:7889/api/scan/series`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState<any>({});

	const handleOptionsClick = () => {
		setContent(settings);
		setIsModalOpen(true);
	};

	const onRefresh = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/scan/series/metadata`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		);
	};

	const setSetting = async (key: string, value: any) => {
		await fetch(`http://${window.location.hostname}:7889/api/settings`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ id: key, value: value }),
		});
	};

	const [selected, setSelected] = useState<string | null>(null);

	const onModalSave = async () => {
		for (const key in content) {
			fetch(`http://${window.location.hostname}:7889/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ id: key, value: content[key] }),
			});
		}
		setIsModalOpen(false);
	};
	return (
		<div className={styles.media}>
			<MediaToolbar
				onUpdate={onUpdate}
				selected={selected}
				setSelected={setSelected}
				settings={settings}
				setSetting={setSetting}
				view={view}
				onRefresh={onRefresh}
				handleOptionsClick={handleOptionsClick}
			/>
			{isModalOpen && (
				<div className={styles.modalBackdrop}>
					<div className={styles.modalContent}>
						<MediaModel
							type={view}
							isOpen={isModalOpen}
							setIsOpen={setIsModalOpen}
							onSave={onModalSave}
							content={content}
							setContent={setContent}
						/>
					</div>
				</div>
			)}
			<div className={styles.mediaContent}>
				<div className={styles.contentContainer}>
					{view === "table" && (
						<Table
							settings={settings}
							profiles={profiles}
							sortedSeries={sortedSeries}
						/>
					)}
					{view === "posters" && (
						<Posters settings={settings} sortedSeries={sortedSeries || []} />
					)}
					{view === "overview" && (
						<Overviews
							sortedSeries={sortedSeries}
							settings={settings}
							profiles={profiles}
						/>
					)}
					<div className={styles.footerContent}>{series && <Footer />}</div>
				</div>
			</div>
		</div>
	);
};
export default ExplorerComponent;
