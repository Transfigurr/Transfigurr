import styles from "./Media.module.scss";
import PosterComponent from "../poster/Poster";
import ToolBar from "../ToolBar/ToolBar";
import Footer from "../footer/Footer";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { useContext, useState } from "react";
import { ReactComponent as Rss } from "../svgs/rss_feed.svg";
import { ReactComponent as Sync } from "../svgs/cached.svg";
import { ReactComponent as AppsIcon } from "../svgs/apps.svg";
import { ReactComponent as ViewIcon } from "../svgs/visibility.svg";
import { ReactComponent as SortIcon } from "../svgs/sort.svg";
import { ReactComponent as FilterIcon } from "../svgs/filter.svg";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { ReactComponent as BookmarkFilled } from "../svgs/bookmark_filled.svg";
import { ReactComponent as BookmarkUnfilled } from "../svgs/bookmark_unfilled.svg";
import { ReactComponent as ContinuingIcon } from "../svgs/play_arrow.svg";
import { ReactComponent as StoppedIcon } from "../svgs/stop.svg";
import MediaModel from "../mediaModal/MediaModal";
import Overview from "../overview/Overview";
import { Link } from "react-router-dom";

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

	const leftToolBarItems: any = [
		<ToolBarItem
			text="Scan"
			index={0}
			icon={
				<Sync
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			onClick={onUpdate}
			selected={selected}
			setSelected={setSelected}
		/>,
		<ToolBarItem
			text="Metadata"
			index={1}
			icon={
				<Rss
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			onClick={onRefresh}
			selected={selected}
			setSelected={setSelected}
		/>,
	];

	const middleToolBarItems: any = [
		<ToolBarItem
			text="Options"
			index={2}
			settings={settings}
			icon={
				<AppsIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			onClick={handleOptionsClick}
			selected={selected}
			setSelected={setSelected}
		/>,
	];
	const rightToolBarItems: any = [
		<ToolBarItem
			text="View"
			index={3}
			settings={settings}
			icon={
				<ViewIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			selected={selected}
			setSelected={setSelected}
			dropdownItems={[
				{
					text: "Table",
					id: "table",
					setting_id: "media_view",
					onClick: () => setSetting("media_view", "table"),
				},
				{
					text: "Posters",
					setting_id: "media_view",
					id: "posters",
					onClick: () => setSetting("media_view", "posters"),
				},
				{
					text: "Overview",
					setting_id: "media_view",
					id: "overview",
					onClick: () => setSetting("media_view", "overview"),
				},
			]}
		/>,
		<ToolBarItem
			text="Sort"
			index={4}
			settings={settings}
			icon={
				<SortIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			selected={selected}
			setSelected={setSelected}
			dropdownItems={[
				{
					text: "Monitored/Status",
					id: "monitored/status",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "monitored/status"),
				},
				{
					text: "Title",
					id: "title",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "title"),
				},
				{
					text: "Network",
					id: "network",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "network"),
				},
				{
					text: "Profile",
					id: "profile",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "profile"),
				},
				{
					text: "Episode Count",
					id: "episodes",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "episodes"),
				},
				{
					text: "Size On Disk",
					id: "size",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "size"),
				},
			]}
		/>,
		<ToolBarItem
			text="Filter"
			index={5}
			icon={
				<FilterIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			selected={selected}
			settings={settings}
			setSelected={setSelected}
			dropdownItems={[
				{
					text: "All",
					id: "all",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "all"),
				},
				{
					text: "Monitored Only",
					id: "monitored",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "monitored"),
				},
				{
					text: "Unmonitored Only",
					id: "unmonitored",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "unmonitored"),
				},
				{
					text: "Continuing Only",
					id: "continuing",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "continuing"),
				},
				{
					text: "Ended Only",
					id: "ended",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "ended"),
				},
				{
					text: "Missing Episodes",
					id: "missing",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "missing"),
				},
			]}
		/>,
	];

	return (
		<div className={styles.media}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			{isModalOpen ? (
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
			) : (
				<></>
			)}
			<div className={styles.mediaContent}>
				<div className={styles.contentContainer}>
					<div className={styles.content}>
						{view === "table" ? (
							<table className={styles.table}>
								<tr>
									<th></th>
									<th>Series</th>
									<th>Profile</th>
									<th>Path</th>
									<th>Space Saved</th>
									<th>Size on Disk</th>
									<th>Setting Icon</th>
								</tr>
								{sortedSeries.map((series: any) => (
									<tr className={styles.row}>
										<td className={styles.iconCell}>
											{series?.monitored ? (
												<BookmarkFilled className={styles.monitored} />
											) : (
												<BookmarkUnfilled className={styles.monitored} />
											)}
											{series?.status !== "Ended" ? (
												<ContinuingIcon className={styles.continue} />
											) : (
												<StoppedIcon className={styles.stopped} />
											)}
										</td>
										<td>
											<a href={"/series/" + series?.id} className={styles.name}>
												{series?.id}
											</a>
										</td>
										<td>{profiles ? profiles[series.profile_id]?.name : ""}</td>
										<td>/series/{series.id}</td>
										<td>{(series.space_saved / 1000000000).toFixed(2)} GB</td>
										<td>{(series.size / 1000000000).toFixed(2)} GB</td>
									</tr>
								))}
							</table>
						) : (
							<></>
						)}

						{view === "posters" ? (
							<>
								{sortedSeries.map((series: any) => (
									<Link to={`series/${series?.id}`} className={styles.poster}>
										<PosterComponent name={series?.id} />
									</Link>
								))}
							</>
						) : (
							<></>
						)}

						{view === "overview" ? (
							<>
								{sortedSeries.map((series: any) => (
									<Overview series={series} />
								))}
							</>
						) : (
							<></>
						)}
					</div>

					<div className={styles.footerContent}>
						{series ? <Footer /> : <></>}
					</div>
				</div>
			</div>
		</div>
	);
};
export default ExplorerComponent;
