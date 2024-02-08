import styles from "./Media.module.scss";
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
import { ReactComponent as TableIcon } from "../svgs/table.svg";

import { WebSocketContext } from "../../contexts/webSocketContext";
import Table from "../table/Table";
import MediaModel from "../mediaModal/MediaModal";
import Posters from "../posters/Posters";
import Overviews from "../overviews/Overviews";

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
				view == "table" ? (
					<TableIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				) : (
					<AppsIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				)
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
					{view === "overview" && <Overviews />}
					<div className={styles.footerContent}>{series && <Footer />}</div>
				</div>
			</div>
		</div>
	);
};
export default ExplorerComponent;
