import styles from "./Media.module.scss";
import PosterComponent from "../poster/Poster";
import ToolBar from "../ToolBar/ToolBar";
import Footer from "../footer/Footer";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import { useContext } from "react";
import { ReactComponent as Rss } from "../svgs/rss_feed.svg";
import { ReactComponent as Sync } from "../svgs/cached.svg";
import { ReactComponent as AppsIcon } from "../svgs/apps.svg";
import { ReactComponent as ViewIcon } from "../svgs/visibility.svg";
import { ReactComponent as SortIcon } from "../svgs/sort.svg";
import { ReactComponent as FilterIcon } from "../svgs/filter.svg";

import { WebSocketContext } from "../../contexts/webSocketContext";
import { Link } from "react-router-dom";

const ExplorerComponent = () => {
	const wsContext = useContext(WebSocketContext);
	const series = wsContext?.data?.series;
	const onUpdate = async () => {
		await fetch(`http://${window.location.hostname}:7889/api/scan/series`, {
			method: "PUT",
		});
	};

	const onRefresh = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/scan/series/metadata`,
			{
				method: "PUT",
			},
		);
	};

	const leftToolBarItems: any = [
		<ToolBarItem
			text="Scan"
			icon={
				<Sync
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			onClick={onUpdate}
		/>,
		<ToolBarItem
			text="Metadata"
			icon={
				<Rss
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
			onClick={onRefresh}
		/>,
	];

	const middleToolBarItems: any = [
		<ToolBarItem
			text="Options"
			icon={
				<AppsIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
		/>,
	];
	const rightToolBarItems: any = [
		<ToolBarItem
			text="View"
			icon={
				<ViewIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
		/>,
		<ToolBarItem
			text="Sort"
			icon={
				<SortIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
		/>,
		<ToolBarItem
			text="Filter"
			icon={
				<FilterIcon
					style={{
						height: "100%",
						width: "100%",
					}}
				/>
			}
		/>,
	];

	const posterClick = (name: any) => {
		if (name) {
			name = "series/" + name.replace(/ /g, "-");
			window.location.href = name;
		}
	};

	return (
		<div className={styles.media}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			<div className={styles.mediaContent}>
				<div className={styles.contentContainer}>
					<div className={styles.content}>
						{Object.keys(series || {})
							?.sort()
							.map((key: any) => (
								<Link to={`series/${key}`} className={styles.poster}>
									<PosterComponent name={key} />
								</Link>
							))}
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
