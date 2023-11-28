import styles from "./History.module.scss";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AppsIcon from "@mui/icons-material/Apps";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import SyncIcon from "@mui/icons-material/Sync";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import ToolBar from "../ToolBar/ToolBar";
import useHistory from "../../hooks/useHistory";
import useProfiles from "../../hooks/useProfiles";

const History = () => {
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

	const history = useHistory();
	const profiles: any = useProfiles();
	console.log(history);
	return (
		<div className={styles.history}>
			<ToolBar
				leftToolBarItems={leftToolBarItems}
				middleToolBarItems={middleToolBarItems}
				rightToolBarItems={rightToolBarItems}
			/>
			<table>
				<thead>
					<tr>
						<th>Series</th>
						<th>Episode</th>
						<th>Episode Title</th>
						<th>Current Codec</th>
						<th>Future Codec</th>
						<th>Profile</th>
					</tr>
				</thead>
				<tbody>
					{history?.map((episode: any, index: any) => (
						<tr>
							<td>{episode.series_name}</td>
							<td>
								{episode.season_number}x{episode.episode_number}
							</td>
							<td>{episode.episode_name}</td>
							<td>{episode.video_codec}</td>
							<td>
								{profiles && episode.profile in profiles
									? profiles[episode.profile]["codec"]
									: ""}
							</td>
							<td>
								{profiles && episode.profile in profiles
									? profiles[episode.profile]["name"]
									: ""}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default History;
