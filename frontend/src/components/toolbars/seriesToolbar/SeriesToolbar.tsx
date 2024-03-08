import styles from "./SeriesToolbar.module.scss";
import ToolBarItem from "../../toolBarItem/ToolBarItem";
import ToolBar from "../../toolBar/ToolBar";
import SyncIcon from "../../svgs/cached.svg?react";
import EditIcon from "../../svgs/edit.svg?react";
import LoadingIcon from "../../svgs/loading.svg?react";
import RssFeedIcon from "../../svgs/rss_feed.svg?react";
const SeriesToolbar = ({
	system,
	selected,
	setSelected,
	series,
	handleEditClick,
	series_name,
}: any) => {
	const handleScanClick = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/actions/scan/series/${series_name}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);
	};

	const handleMetadataClick = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/actions/refresh/series/metadata/${series_name}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
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
							: styles.svg
					}
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
					<LoadingIcon className={styles.loading} />
				) : (
					<RssFeedIcon className={styles.svg} />
				)
			}
			onClick={handleMetadataClick}
			selected={selected}
			setSelected={setSelected}
		/>,
		<ToolBarItem
			text="Edit"
			key="edit"
			icon={<EditIcon className={styles.svg} />}
			onClick={handleEditClick}
			selected={selected}
			setSelected={setSelected}
		/>,
	];
	return <ToolBar leftToolBarItems={leftToolBarItems} />;
};
export default SeriesToolbar;
