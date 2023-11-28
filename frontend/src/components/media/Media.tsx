import styles from "./Media.module.scss";
import PosterComponent from "../poster/Poster";
import JumpBar from "../jumpbar/JumpBar";
import ToolBar from "../ToolBar/ToolBar";
import Footer from "../footer/Footer";
import ToolBarItem from "../ToolBarItem/ToolBarItem";

import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AppsIcon from "@mui/icons-material/Apps";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import SyncIcon from "@mui/icons-material/Sync";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import { useEffect, useState } from "react";
import useSeries from "../../hooks/useSeries";
import useSingleSeries from "../../hooks/useSingleSeries";
const ExplorerComponent = () => {
	const series = useSeries();

	const leftToolBarItems: any = [
		<ToolBarItem text="Update" icon={<SyncIcon fontSize="large" />} />,
		<ToolBarItem text="RSS Sync" icon={<RssFeedIcon fontSize="medium" />} />,
	];

	const middleToolBarItems: any = [
		<ToolBarItem text="Options" icon={<AppsIcon fontSize="large" />} />,
	];
	const rightToolBarItems: any = [
		<ToolBarItem text="View" icon={<VisibilityIcon fontSize="medium" />} />,
		<ToolBarItem text="Sort" icon={<SwitchLeftIcon fontSize="medium" />} />,
		<ToolBarItem text="Filter" icon={<FilterAltIcon fontSize="medium" />} />,
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
						{series.map((value) => (
							<div className={styles.poster} onClick={() => posterClick(value)}>
								<PosterComponent name={value} />
							</div>
						))}
					</div>

					<div className={styles.footerContent}>
						{
							//<Footer data={series} />
						}
					</div>
				</div>
				<JumpBar />
			</div>
		</div>
	);
};
export default ExplorerComponent;
