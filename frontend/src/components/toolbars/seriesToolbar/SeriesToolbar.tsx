import ToolBarItem from "../../ToolBarItem/ToolBarItem";
import ToolBar from "../../ToolBar/ToolBar";
import { ReactComponent as SyncIcon } from "../../svgs/cached.svg";
import styles from "./SeriesToolbar.module.scss";
import { ReactComponent as EditIcon } from "../../svgs/edit.svg";
import { ReactComponent as LoadingIcon } from "../../svgs/loading.svg";
import { ReactComponent as RssFeedIcon } from "../../svgs/rss_feed.svg";
const SeriesToolbar = ({
	system,
	handleScanClick,
	selected,
	setSelected,
	series,
	handleEditClick,
	handleMetadataClick,
}: any) => {
	const leftToolBarItems: any = [
		<ToolBarItem
			text="Scan"
			key="scan"
			icon={
				<SyncIcon
					className={
						system?.scan_running && system?.scan_target == series?.id
							? styles.spinning
							: ""
					}
					style={{
						height: "100%",
						width: "100%",
					}}
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
					<RssFeedIcon
						style={{
							height: "100%",
							width: "100%",
						}}
					/>
				)
			}
			onClick={handleMetadataClick}
			selected={selected}
			setSelected={setSelected}
		/>,
		<ToolBarItem
			text="Edit"
			key="edit"
			icon={<EditIcon />}
			onClick={handleEditClick}
			selected={selected}
			setSelected={setSelected}
		/>,
	];
	return <ToolBar leftToolBarItems={leftToolBarItems} />;
};
export default SeriesToolbar;
