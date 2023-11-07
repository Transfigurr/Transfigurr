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
const ExplorerComponent = () => {
	const numberOfComponents = 48;
	const posters = [];

	for (let i: number = 1; i < numberOfComponents; i++) {
		posters.push(<PosterComponent id={i} key={i} />);
	}

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

	return (
		<div className={styles.media}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			<div className={styles.mediaContent}>
				<div className={styles.contentContainer}>
					<div className={styles.content}>{posters}</div>
					<div className={styles.footerContent}>
						<Footer />
					</div>
				</div>
				<JumpBar />
			</div>
		</div>
	);
};
export default ExplorerComponent;
