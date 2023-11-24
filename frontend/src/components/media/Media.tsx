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
const ExplorerComponent = () => {
	const [series, setSeries] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8000/api/data/series")
			.then((response) => response.json())
			.then((data) => setSeries(data))
			.catch((error) => console.error(error));
	}, []);

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

	const posterClick = (data: any) => {
		if (data.name) {
			data.name = "series/" + data.name.replace(/ /g, "-");
			window.location.href = data.name;
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
						{series.map((obj: any) => (
							<div className={styles.poster} onClick={() => posterClick(obj)}>
								<PosterComponent data={obj} />
							</div>
						))}
					</div>

					<div className={styles.footerContent}>
						<Footer data={series} />
					</div>
				</div>
				<JumpBar />
			</div>
		</div>
	);
};
export default ExplorerComponent;
