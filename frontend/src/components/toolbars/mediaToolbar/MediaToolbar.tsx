import styles from "./MediaToolbar.module.scss";
import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import { ReactComponent as Rss } from "../../svgs/rss_feed.svg";
import { ReactComponent as Sync } from "../../svgs/cached.svg";
import { ReactComponent as AppsIcon } from "../../svgs/apps.svg";
import { ReactComponent as ViewIcon } from "../../svgs/visibility.svg";
import { ReactComponent as SortIcon } from "../../svgs/sort.svg";
import { ReactComponent as FilterIcon } from "../../svgs/filter.svg";
import { ReactComponent as TableIcon } from "../../svgs/table.svg";
import { ReactComponent as OverviewIcon } from "../../svgs/view_list.svg";
import { ReactComponent as LoadingIcon } from "../../svgs/loading.svg";
import ToolBar from "../../ToolBar/ToolBar";
const MediaToolbar = ({
	onUpdate,
	selected,
	setSelected,
	settings,
	system,
	setSetting,
	view,
	onRefresh,
	handleOptionsClick,
}: any) => {
	const leftToolBarItems: any = [
		<ToolBarItem
			text="Scan All"
			index={0}
			key={0}
			icon={
				<Sync
					className={system?.scan_running === "1" ? styles.spinning : ""}
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
			text="Refresh Metadata"
			index={1}
			key={1}
			icon={
				system?.metadata_running == "1" ? (
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
					<Rss
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				)
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
			key={2}
			settings={settings}
			icon={
				view === "table" ? (
					<TableIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				) : view === "posters" ? (
					<AppsIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				) : view === "overview" ? (
					<OverviewIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				) : null
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
			key={3}
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
					key: "table",
					setting_id: "media_view",
					onClick: () => setSetting("media_view", "table"),
				},
				{
					text: "Posters",
					setting_id: "media_view",
					id: "posters",
					key: "posters",
					onClick: () => setSetting("media_view", "posters"),
				},
				{
					text: "Overview",
					setting_id: "media_view",
					id: "overview",
					key: "overview",
					onClick: () => setSetting("media_view", "overview"),
				},
			]}
		/>,
		<ToolBarItem
			text="Sort"
			index={4}
			key={4}
			settings={settings}
			sortDirection={settings?.media_sort_direction}
			sort={true}
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
					key: "monitored/status",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "monitored/status"),
				},
				{
					text: "Title",
					id: "title",
					key: "title",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "title"),
				},
				{
					text: "Network",
					id: "network",
					key: "network",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "network"),
				},
				{
					text: "Profile",
					id: "profile",
					key: "profile",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "profile"),
				},
				{
					text: "Episode Count",
					id: "episodes",
					key: "episodes",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "episodes"),
				},
				{
					text: "Size On Disk",
					id: "size",
					key: "size",
					setting_id: "media_sort",
					onClick: () => setSetting("media_sort", "size"),
				},
			]}
		/>,
		<ToolBarItem
			text="Filter"
			index={5}
			key={5}
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
					key: "all",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "all"),
				},
				{
					text: "Monitored Only",
					id: "monitored",
					key: "monitored",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "monitored"),
				},
				{
					text: "Unmonitored Only",
					id: "unmonitored",
					key: "unmonitored",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "unmonitored"),
				},
				{
					text: "Continuing Only",
					id: "continuing",
					key: "continuing",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "continuing"),
				},
				{
					text: "Ended Only",
					id: "ended",
					key: "ended",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "ended"),
				},
				{
					text: "Missing Episodes",
					id: "missing",
					key: "missing",
					setting_id: "media_filter",
					onClick: () => setSetting("media_filter", "missing"),
				},
			]}
		/>,
	];
	return (
		<ToolBar
			leftToolBarItems={leftToolBarItems}
			middleToolBarItems={middleToolBarItems}
			rightToolBarItems={rightToolBarItems}
		/>
	);
};

export default MediaToolbar;
